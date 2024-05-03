import { query } from '@/lib/db';
import { tableName, allTables } from '../../../../lib/company';

export default async function handler(req, res) {
    
    const computerType = req.query.computerType

    let totalBranch = [];

  try {
    const values = [`%${computerType}%`]
    let count = 0;
    for (const table of allTables) {
      const result = await query(`SELECT COUNT(*) AS count FROM ${table.name} WHERE computer_type LIKE ?`, values);
      count += result[0].count
    }
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching count data:', error);
    res.status(500).json({ error: 'Failed to fetch count datas' });
  }
}