
import { query } from '@/lib/db';

export default async function handler (req, res) {
    const {id} = req.query
    if (req.method === 'GET') {
        try {
            if (id) { // If ID is provided, fetch specific data
                const data = `SELECT * FROM deliver WHERE id = ?`;
                const values = [id];
                const deliver = await query(data, values);

                if (deliver.length === 0) {
                    return res.status(404).json({ error: 'deliver not found' });
                }

                res.status(200).json({ results: deliver });
            //   console.log(id)
            //   console.log({results: inventory})
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}