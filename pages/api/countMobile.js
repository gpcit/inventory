import { query } from '@/lib/db';
import { tableName } from '../../lib/company';

export default async function handler(req, res) {
  try {
    let count = 0;
    for (const table of tableName) {
      const result = await query(`SELECT COUNT(*) AS count FROM ${table.table}`);
      count += result[0].count
    }
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching count data:', error);
    res.status(500).json({ error: 'Failed to fetch count datas' });
  }
}