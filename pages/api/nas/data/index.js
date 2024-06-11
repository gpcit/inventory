import { query } from '@/lib/db';
import ping from 'ping';
import { NasInventory } from '@/lib/definition'

export default async function handler(req, res) {
    if(req.method === "GET") {
        try {
        let getQuery;
        let values = [];
        let pageTotal;
            getQuery = `SELECT * FROM nas_table`;

            const nas = await query(getQuery)

            const nasWithPingStatus = await Promise.all(nas.map(async (item) => {
                const pingResult = await ping.promise.probe(item.ip_address);
                return {
                    ...item,
                    online: pingResult.alive
                }
            }))
            res.status(200).json({ results: nasWithPingStatus });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const {name, company_name, ip_address, mac_address, manufacturer, model, specs, location_area, date_purchased, date_installed} = req.body

            const ip_checker = await query(`SELECT * FROM nas_table WHERE ip_address = ?`,[ip_address])
            const company = ip_checker.map(ip => ip.company_name)
            if(ip_checker.length > 0 ) {
                return res.status(400).json({error: `IP Address is already belongs to ${company}`})
            }

            const insertQuery = await query(`INSERT INTO nas_table(name, company_name, ip_address, mac_address, manufacturer, model, specs, location_area, date_purchased, date_installed) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [name, company_name, ip_address, mac_address, manufacturer, model, specs, location_area, date_purchased, date_installed]);

            if(!insertQuery.insertId) {
                return res.status(400).json({error: 'Failed to insert a data to Nas Table'})
            }

            let nas_data = {
                id: insertQuery.insertId,
                name: name,
                company_name: company_name,
                ip_address: ip_address,
                mac_address: mac_address,
                manufacturer: manufacturer,
                mode: model,
                specs: specs,
                location_area: location_area,
                date_purchased: date_purchased,
                date_installed: date_installed
            }

            return res.status(200).json({response: {message: 'success', results: nas_data}})

        } catch (error) {
            console.error('Error adding delivered:', error);
           
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}