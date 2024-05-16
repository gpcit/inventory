import { query } from '@/lib/db';


export default async function handler (req, res) {
    const { id } = req.query
    if(req.method === 'GET') {
        try {
            const userQuery = `SELECT * FROM users`
            const data = await query(userQuery)
            if (data.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ user: data })
           
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Errors' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed '})
      }
}