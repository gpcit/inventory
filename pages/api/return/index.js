import { query } from '@/lib/db';
export default async function handler(req, res) {
    const page = req.query.page || 1
    const itemPerPage = 10;
    if (req.method === 'POST') {
        try {
            const { date_returned, item_name, item_description, quantity, name, deliver_id } = req.body;
            if (!quantity) {
                return res.status(400).json({ error: 'Please specify the returned quantity' });
            }

            // Insert into the return_table
            const insertData = await query(
                `INSERT INTO return_table (date_returned, item_name, item_description, quantity, name, deliver_id) VALUES (?, ?, ?, ?, ?, ?)`,
                [date_returned, item_name, item_description, quantity, name, deliver_id]
            );

            if (!insertData.insertId) {
                return res.status(500).json({ error: 'Failed to insert into deliver table' });
            }

            // Update the supplies table
            const updateSupplies = await query(
                `UPDATE supplies SET stock_quantity = stock_quantity + ? WHERE description = ?`,
                [quantity, item_description]
            );

            if (updateSupplies.affectedRows === 0) {
                
                return res.status(400).json({ error: 'Failed to update supplies table or item not found' });
            }

            let returned = {
                id: insertData.insertId,
                date_returned: date_returned,
                item_name: item_name,
                item_description: item_description,
                quantity: quantity,
                name: name,
                deliver_id: deliver_id,
            };
            res.status(200).json({ response: { message: 'success', results: returned } });
        } catch (error) {
            console.error('Error adding delivered:', error);
           
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'GET') {
        try {
        let getQuery;
        let values = [];
        let pageTotal;

            pageTotal = `SELECT COUNT(*) AS total FROM return_table`
            getQuery = `SELECT * FROM return_table GROUP BY id desc LIMIT ? OFFSET ?`;
            values = [itemPerPage, (page - 1) * itemPerPage]

            const [returned, totalCountRows] = await Promise.all([
                query(getQuery, values),
                query(pageTotal)
            ]);
            const totalCount = totalCountRows[0].total
            const totalPages = Math.ceil(totalCount / itemPerPage)

            res.status(200).json({ results: returned, totalPages });
        } catch (error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}