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
                      WHERE (assigned_to LIKE ? OR department LIKE ? OR imei LIKE ? OR number LIKE ? OR serial_number LIKE ?) 
                      AND is_active_id = 1 
                      LIMIT ? 
                      OFFSET ?`;
              values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, itemPerPage, (page - 1) * itemPerPage]
            
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
        const { assigned_to, department, brand, model_specs, imei, number, email_password, serial_number, inclusion, comment, date_issued, is_active_id, date_purchased, date_returned, user_id, user_name, company_name, details, db_table, actions} = req.body
        
        if (!serial_number || serial_number === ' ') {
          return res.status(400).json({ error: 'Type "N/A + Brand Name" if Serial number is not applicable' });
        }
        const duplicateCheck = await query(`SELECT * FROM ${tableName} WHERE serial_number = ?`, [serial_number])
        const seperate = duplicateCheck.map(data => data.department)
        if(duplicateCheck.length > 0){
          return res.status(400).json({ error: `Serial Number belongs to ${seperate} Department`})
        }
        const addInventory = await query(`INSERT INTO ${tableName} (assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, comment, date_issued, date_purchased, is_active_id, date_returned) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, comment, date_issued, date_purchased, is_active_id, date_returned],);
        let message;
        if (addInventory.insertId) {
          message = 'success';
        } else {
          message = 'failed';
        }

        const addActivityLog = await query(`INSERT INTO activity_log (user_id, user_name, company_name, details, db_table, actions) VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, user_name, company_name, details, tableName, actions]);

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
          date_purchased: date_purchased,
          date_returned: date_returned
        };
  
        res.status(200).json({ response: { message: message, results: inventory } });
      } catch (error) {
        console.error('Error adding inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}