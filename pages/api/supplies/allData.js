import { query } from '@/lib/db';

export default async function handler (req, res) {
   
    if(req.method === 'GET'){
        try {
        let getQuery;
        let pageTotal

            pageTotal = `SELECT COUNT(*) AS total FROM supplies`
            getQuery = `SELECT * FROM supplies`

            const supplies = await query(getQuery)

            res.status(200).json({ results: supplies })
        } catch(error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ error: 'Internal Server Errors' });
        }
    } 
}