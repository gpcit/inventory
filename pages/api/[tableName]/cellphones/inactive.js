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
                pageTotal = `SELECT COUNT(*) as total FROM ${tableName} WHERE is_active_id = 2`
                data = `SELECT * FROM ${tableName}
                      WHERE (assigned_to LIKE ? OR department LIKE ? OR number LIKE ? OR serial_number LIKE ?) 
                      AND is_active_id = 2 
                      LIMIT ? 
                      OFFSET ?`;
              values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, itemPerPage, (page - 1) * itemPerPage]
            
            } else {
                pageTotal = `SELECT COUNT(*) as total FROM ${tableName} WHERE is_active_id = 2`
                data = `SELECT * FROM ${tableName} WHERE is_active_id = 2 ORDER BY date_created desc LIMIT ? OFFSET ?`;
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
        const assigned_to = req.body.assigned_to;
        const department = req.body.department
        const brand = req.body.brand;
        const model_specs = req.body.model_specs;
        const imei = req.body.imei;
        const number = req.body.number;
        const email_password = req.body.email_password;
        const serial_number = req.body.serial_number;
        const inclusion = req.body.inclusion;
        const comment = req.body.comment;
        const date_issued = req.body.date_issued
        const is_active_id = req.body.is_active_id
        const date_purchased = req.body.date_purchased
        if (!assigned_to || !brand) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const duplicateCheck = await query(`SELECT * FROM ${tableName} WHERE serial_number = ?`, [serial_number])
        const seperate = duplicateCheck.map(data => data.department)
        if(duplicateCheck.length > 0){
          return res.status(400).json({ error: `Serial Number belongs to ${seperate}`})
        }
        const addInventory = await query(`INSERT INTO ${tableName} (assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, comment, date_issued, date_purchased, is_active_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, comment, date_issued, date_purchased, is_active_id],);
        let message;
        if (addInventory.insertId) {
          message = 'success';
        } else {
          message = 'failed';
        }
  
        let inventory = {
          id: addInventory.insertId,
          assigned_to: assigned_to,
          department: department,
          brand: brand,
          model_specs: model_specs,
          imei: imei,
          number: number,
          email_password: email_password,
          serial_number: serial_number,
          inclusion: inclusion,
          comment: comment,
          date_issued: date_issued,
          is_active_id: is_active_id,
          date_purchased: date_purchased
        };
  
        res.status(200).json({ response: { message: message, results: inventory } });
      } catch (error) {
        console.error('Error adding inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}