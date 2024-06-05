import { query } from '@/lib/db';

export default async function handler (req, res) {
    const tableName = req.query.tableName;
    const page = req.query.page || 1

    if(req.method === 'GET') {
        try {
            const pageTotal = `SELECT COUNT(*) as total from activity_log WHERE db_table = ?`
            const userQuery = `
            SELECT * FROM activity_log
            ORDER BY date_created desc`
            const activityLog = await query(userQuery)

            // const totalCount = totalCountRows[0].total;
            // const totalPages = Math.ceil(totalCount / itemPerPage)

            res.status(200).json({ activityLog })
           
        } catch (error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ error: 'Internal Server Errors' });
        }
    } else {
        // Handle methods other than GET
        res.status(405).json({ error: 'Method not allowed' });
    }
}


