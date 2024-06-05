
import { query } from '@/lib/db';

export default async function handler (req, res) {
    const {id} = req.query
    if (req.method === 'GET') {
        try {
            if (id) { // If ID is provided, fetch specific data
                const data = `SELECT * FROM supplies WHERE id = ?`;
                const values = [id];
                const supplies = await query(data, values);

                if (supplies.length === 0) {
                    return res.status(404).json({ error: 'supplies not found' });
                }

                res.status(200).json({ results: supplies });
            //   console.log(id)
            //   console.log({results: inventory})
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        const {stock_quantity} = req.body
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
            }
        if(stock_quantity < 0){
            return res.status(400).json({ error: 'QTY must not be less than 0' })
        }
        try {
            
            const updateResult = await query
            (`UPDATE supplies SET stock_quantity=? WHERE id=?`,
            [stock_quantity, id]);
            
            if(updateResult.affectedRows > 0){
              res.status(200).json({response: { message: 'success', updatedItem: id }})
            } else {
              res.status(404).json({ error: 'Item not found or not updated '});
            }
            
          } catch (error) {
            console.error('Error updating inventory: ', error);
            res.status(500).json({ error: 'Internal Server Error'})
          }
    } 
}