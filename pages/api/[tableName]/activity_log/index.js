import { query } from '@/lib/db';

export default async function handler (req, res) {
    const tableName = req.query.tableName;
    const page = req.query.page || 1
    const itemPerPage = 3;

    if(req.method === 'GET') {
        try {
            const pageTotal = `SELECT COUNT(*) as total from activity_log WHERE db_table = ?`
            const userQuery = `
            SELECT * FROM activity_log 
            WHERE db_table = ?
            ORDER BY date_created desc 
            LIMIT ? 
            OFFSET ?`
            const values = [tableName, itemPerPage, (page - 1 ) * itemPerPage]

            const [activityLog, totalCountRows] = await Promise.all([
                query(userQuery, values),
                query(pageTotal, [tableName])
            ]);

            const totalCount = totalCountRows[0].total;
            const totalPages = Math.ceil(totalCount / itemPerPage)

            res.status(200).json({ results: activityLog,  totalPages})
           
        } catch (error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ error: 'Internal Server Errors' });
        }
    } else {
        // Handle methods other than GET
        res.status(405).json({ error: 'Method not allowed' });
    }
}


