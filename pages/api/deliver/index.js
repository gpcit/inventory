import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const getQuery = `SELECT * FROM deliver`;
            const delivered = await query(getQuery);
            res.status(200).json({ results: delivered });
        } catch (error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { quantity, description, location, name, date_acquired } = req.body;
            if (!quantity || !name) {
                return res.status(400).json({ error: 'Missing Fields' });
            }

            // Start a transaction
            await query('START TRANSACTION');

            // Insert into the deliver table
            const insertData = await query(
                `INSERT INTO deliver (quantity, description, location, name, date_acquired) VALUES (?, ?, ?, ?, ?)`,
                [quantity, description, location, name, date_acquired]
            );

            if (!insertData.insertId) {
                await query('ROLLBACK');
                return res.status(500).json({ error: 'Failed to insert into deliver table' });
            }

            // Update the supplies table
            const updateSupplies = await query(
                `UPDATE supplies SET stock_quantity = stock_quantity - ? WHERE name = ?`,
                [quantity, description]
            );

            if (updateSupplies.affectedRows === 0) {
                await query('ROLLBACK');
                return res.status(400).json({ error: 'Failed to update supplies table or item not found' });
            }

            // Commit the transaction
            await query('COMMIT');

            let delivered = {
                id: insertData.insertId,
                quantity: quantity,
                description: description,
                location: location,
                name: name,
                date_acquired: date_acquired,
            };
            res.status(200).json({ response: { message: 'success', results: delivered } });
        } catch (error) {
            console.error('Error adding delivered:', error);
            await query('ROLLBACK');
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
