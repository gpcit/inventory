import { query } from '@/lib/db';
import  {tableName}  from '../../lib/company';

export default async function handler(req, res) {
    const page = req.query.page || 1;
    const itemPerPage = 2;

    if (req.method === 'GET') {
        try {
            let inventory = [];
            let totalCount = 0;

            // Calculate the total count of all records across all tables
            for (const table of tableName) {
                const tableTotalCountRows = await query(`SELECT COUNT(*) AS total FROM ${table.table} WHERE date_issued IS NOT NULL AND date_issued != '' AND date_issued <= DATE_SUB(NOW(), INTERVAL 5 YEAR)`);
                totalCount += tableTotalCountRows[0].total;
            }

            // Calculate the total pages based on the total count
            const totalPages = Math.ceil(totalCount  / (itemPerPage * 3) );

            // Calculate the offset based on the current page
            const offset = (page - 1) * itemPerPage;

            // Fetch records for the current page
            for (const table of tableName) {
                const tableInventory = await query(`SELECT *, '${table.displayName}' AS source_table FROM ${table.table} WHERE date_issued IS NOT NULL AND date_issued != '' AND date_issued <= DATE_SUB(NOW(), INTERVAL 5 YEAR) ORDER BY date_issued DESC LIMIT ? OFFSET ?`, [itemPerPage, offset]);
                inventory = inventory.concat(tableInventory);
            }
            
            res.status(200).json({ results: inventory, totalPages });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
