import { query } from '@/lib/db';


export default async function handler (req, res) {
    const tableName = req.query.tableName;
    const searchQuery = req.query.query;
    const page = req.query.page || 1
    const itemPerPage = 5;

    if (req.method === 'GET') {
        try {
          let data;
          let pageTotal;
          let values = []
            if(searchQuery) {
              pageTotal = `SELECT COUNT(*) as total FROM ${tableName} WHERE is_active_id = 1`
              data = `SELECT * FROM ${tableName}
                      WHERE (assigned_to LIKE ? OR department LIKE ? OR printer_name LIKE ? OR serial_number LIKE ?) 
                      AND is_active_id = 1 
                      LIMIT ? 
                      OFFSET ?`;
              values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, itemPerPage, (page - 1) * itemPerPage]
            
            } else {
              pageTotal = `SELECT COUNT(*) as total FROM ${tableName} WHERE is_active_id = 1`
              data = `SELECT * FROM ${tableName} WHERE is_active_id = 1 ORDER BY date_created desc LIMIT ? OFFSET ?`;
              values = [itemPerPage, (page - 1) * itemPerPage]
              }
            const [inventory, totalCountRows] = await Promise.all([
              query(data, values),
              query(pageTotal)
            ]);
            const totalCount = totalCountRows[0].total;
            const totalPages = Math.ceil(totalCount / itemPerPage)
            res.status(200).json({ results: inventory, totalPages})
        } catch ( error ) {
            res.status(500).json({ error: 'Internal Server Errors' });
        }
    } else if (req.method === 'POST') {
      try {
        const printer_name = req.body.printer_name;
        const assigned_to = req.body.assigned_to;
        const department = req.body.department
        const manufacturer = req.body.manufacturer;
        const model = req.body.model;
        const ink_type = req.body.ink_type;
        const description = req.body.description;
        const serial_number = req.body.serial_number;
        const comment = req.body.comment;
        const date_installed = req.body.date_installed
        const is_active_id = req.body.is_active_id
        const date_purchased = req.body.date_purchased
        const date_pullout = req.body.date_pullout
        if (!serial_number || serial_number === ' ') {
          return res.status(400).json({ error: 'Type "N/A + Brand Name" if Serial number is not applicable' });
        }
        const duplicateCheck = await query(`SELECT * FROM ${tableName} WHERE serial_number = ?`, [serial_number])
        const separate = duplicateCheck.map(data => data.department)
        if(duplicateCheck.length > 0){
          return res.status(400).json({ error: `Serial Number belongs to ${separate} Department`})
        }
        const addInventory = await query(`INSERT INTO ${tableName} (printer_name, assigned_to, department, manufacturer, model, serial_number, ink_type, description, comment, date_installed, date_purchased, is_active_id, date_pullout) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [printer_name, assigned_to, department, manufacturer, model, serial_number, ink_type, description, comment, date_installed, date_purchased, is_active_id, date_pullout],);
        let message;
        if (addInventory.insertId) {
          message = 'success';
        } else {
          message = 'failed';
        }
  
        let inventory = {
          id: addInventory.insertId,
          printer_name: printer_name,
          assigned_to: assigned_to,
          department: department,
          manufacturer: manufacturer,
          model: model,
          ink_type: ink_type,
          description: description,
          serial_number: serial_number,
          comment: comment,
          printer_name: printer_name,
          is_active_id: is_active_id,
          date_purchased: date_purchased,
          date_pullout: date_pullout
        };
  
        res.status(200).json({ response: { message: message, results: inventory } });
      } catch (error) {
        console.error('Error adding inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}