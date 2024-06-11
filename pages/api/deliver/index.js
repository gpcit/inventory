import { query } from '@/lib/db';

export default async function handler(req, res) {
    const page = req.query.page || 1
    const itemPerPage = 10;
    if (req.method === 'GET') {
        try {
        let getQuery;
        let values = [];
        let pageTotal;

            pageTotal = `SELECT COUNT(*) AS total FROM deliver`
            getQuery = `SELECT * FROM deliver WHERE id NOT IN(SELECT deliver_id FROM return_table) GROUP BY id desc LIMIT ? OFFSET ?`;
            values = [itemPerPage, (page - 1) * itemPerPage]

            const [delivered, totalCountRows] = await Promise.all([
                query(getQuery, values),
                query(pageTotal)
            ]);
            const totalCount = totalCountRows[0].total
            const totalPages = Math.ceil(totalCount / itemPerPage)

            res.status(200).json({ results: delivered, totalPages });
        } catch (error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { quantity, item_name, description, location, name, date_acquired } = req.body;
            if (!quantity || !name) {
                return res.status(400).json({ error: 'Missing Fields' });
            }

            // Insert into the deliver table
            const insertData = await query(
                `INSERT INTO deliver (quantity, item_name, description, location, name, date_acquired) VALUES (?, ?, ?, ?, ?, ?)`,
                [quantity, item_name, description, location, name, date_acquired]
            );

            if (!insertData.insertId) {
                return res.status(500).json({ error: 'Failed to insert into deliver table' });
            }

            // Update the supplies table
            const updateSupplies = await query(
                `UPDATE supplies SET stock_quantity = stock_quantity - ? WHERE description = ?`,
                [quantity, description]
            );

            if (updateSupplies.affectedRows === 0) {
               
                return res.status(400).json({ error: 'Failed to update supplies table or item not found' });
            }

            let delivered = {
                id: insertData.insertId,
                quantity: quantity,
                description: description,
                item_name: item_name,
                location: location,
                name: name,
                date_acquired: date_acquired,
            };
            res.status(200).json({ response: { message: 'success', results: delivered } });
        } catch (error) {
            console.error('Error adding delivered:', error);
            
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
