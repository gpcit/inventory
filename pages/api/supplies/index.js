import { query } from '@/lib/db';

export default async function handler (req, res) {

    if(req.method === 'GET'){
        try {
            const getQuery = `SELECT * FROM supplies`
            const supplies = await query(getQuery)
            res.status(200).json({ results: supplies })
        } catch(error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ error: 'Internal Server Errors' });
        }
    } else if(req.method === 'POST') {
        try {
            const { item_no, name, manufacturer, description, cost_per_item, stock_quantity, reorder_level, days_per_reorder, item_reorder_quantity, item_discontinued } = req.body

            if(!name || !stock_quantity) {
                return res.status(400).json({error: "Missing fields for Item Name and Quantity"})
            }
            const insertData = await query(`INSERT INTO supplies (item_no, name, manufacturer, description, cost_per_item, stock_quantity, reorder_level, days_per_reorder, item_reorder_quantity, item_discontinued) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [item_no, name, manufacturer, description, cost_per_item, stock_quantity, reorder_level, days_per_reorder, item_reorder_quantity, item_discontinued])

            let message;
            if(insertData.insertId){
                message = 'success'
            } else {
                message = 'failed'
            }

            let supplies = {
                id: insertData.insertId,
                item_no: item_no,
                name: name,
                manufacturer: manufacturer,
                description: description,
                cost_per_item: cost_per_item,
                stock_quantity: stock_quantity,
                reorder_level: reorder_level,
                days_per_reorder: days_per_reorder,
                item_reorder_quantity: item_reorder_quantity,
                item_discontinued: item_discontinued
            };
            res.status(200).json({response: { message: message, results: supplies}})
        } catch (error) {
            console.error('Error adding supplies:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}