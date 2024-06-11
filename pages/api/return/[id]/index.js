
import { query } from '@/lib/db';

export default async function handler (req, res) {
    const {id} = req.query;
    if (req.method === 'PUT') {
        try {
            if (!id) {
                return res.status(400).json({ error: 'ID is required' });
                }
            if(stock_quantity < 0){
                return res.status(400).json({ error: 'QTY must not be less than 0' })
            }
                
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