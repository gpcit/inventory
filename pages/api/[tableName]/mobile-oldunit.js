import {query} from '@/lib/db'

export default async function handler (req, res) {
    const tableName = req.query.tableName;
    
        try {
            
            const fiveYearsAgo = new Date();
            fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5)
           
            let result = await query(`SELECT COUNT(*) as count FROM ${tableName} WHERE date_issued IS NOT NULL AND date_issued != '' AND  date_issued <= ?`, [fiveYearsAgo])
            const count = result[0].count;
            res.status(200).json({ count })
        } catch (error) {
            console.error('Error fetching the data:', error)
            res.status(500).json({error: 'Intenal Error to'})
        }
}
