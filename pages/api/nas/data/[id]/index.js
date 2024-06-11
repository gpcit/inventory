import { query } from '@/lib/db'

export default async function handler(req, res) {
    const { id } = req.query
    if(req.method === 'GET') {
        try {
            if(id) {
            const getQuery = `SELECT * FROM nas_table WHERE id = ?`
            const values = [id]
            const data = await query(getQuery, values)
            
            
            if(data.length === 0) {
                return res.status(404).json({error: 'Data not found'})
            }

            res.status(200).json( { results: data } )
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
           
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const {name, company_name, ip_address, mac_address, manufacturer, model, specs, location_area, date_purchased, date_installed} = req.body

            const find_ip = await query(`SELECT * FROM nas_table where ip_address = ? AND id != ?`, [ip_address, id])
            
            if(find_ip.length > 0) {
               return res.status(400).json({error: `IP Address is already existing or currently use`})
            }
            

            const updateQuery = await query(`UPDATE nas_table SET name=?, company_name=?, ip_address=?, mac_address=?, manufacturer=?, model=?, specs=?, location_area=?, date_purchased=?, date_installed=? WHERE id=?`, [name, company_name, ip_address, mac_address, manufacturer, model, specs, location_area, date_purchased, date_installed, id])

            
           
            if(updateQuery.affectedRows > 0) {
                res.status(200).json({response: {message: 'success', updatedId: id}})
            } else {
                res.status(404).json({error: `Data not found or not updated`})
            }
            
        } catch (error) {
            console.error('Error updating inventory: ', error);
            res.status(500).json({ error: 'Internal Server Error'})
        }
    }
}