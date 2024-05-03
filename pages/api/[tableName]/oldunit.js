import {query} from '@/lib/db'
import { tableName } from '../../../lib/company';

export default async function handler (req, res) {
    if(req.method === 'GET'){
        try {
            const results = []

            for (const table of tableName){
            let data = `SELECT *, '${table.displayName}' AS source_table FROM ${table.name} WHERE date_purchased <= DATE_SUB(NOW(), INTERVAL 5 YEAR)`
            const inventory = await query(data)
            results.push(...inventory)
            }
        console.log(results)
        res.status(200).json({ results })
        } catch (error) {
            console.error('Error fetching the data:', error)
            res.status(500).json({error: 'Intenal Error to'})
        }
    } 
}