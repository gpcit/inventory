import { query } from '@/lib/db';

export default async function handler(req, res) {
    const tableName = req.query.tableName;
    const {id} = req.query
    if (req.method === 'GET') {
      try {
          if (id) { // If ID is provided, fetch specific data
              const data = `SELECT * FROM ${tableName} WHERE id = ?`;
              const values = [id];
              const inventory = await query(data, values);

              if (inventory.length === 0) {
                  return res.status(404).json({ error: 'Inventory not found' });
              }
              res.status(200).json({ results: inventory });
            //   console.log(id)
            //   console.log({results: inventory})
          }
      } catch (error) {
          
          res.status(500).json({ error: 'Internal Server Error' });
      }
  } else if (req.method === 'POST') {
    try {

      const { assigned_to, department, brand, model_specs, imei, number, email_password, serial_number, inclusion, comment, date_issued, is_active_id, date_purchased, date_returned, user_id, user_name, company_name, details, db_table, actions} = req.body

      if (!assigned_to || !brand) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const addInventory = await query(`INSERT INTO ${db_table} (assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, comment, date_issued, date_purchased, is_active_id, date_returned) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, date_issued, date_purchased, is_active_id, date_returned],);
      let message;
      if (addInventory.insertId) {
        message = 'success';
      } else {
        message = 'failed';
      }

      // const remoteData = await query(`DELETE FROM ${tableName} WHERE id=?`, [id])
      // if(remoteData.affectedRows > 0) {
      //   res.status(200).json({ response: { message: 'success', deletedItem: id } })
      // } else {
      //   res.status(404).json({ error: 'Item not found or not deleted' })
      // }
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
        date_purchased: date_purchased,
        is_active_id: is_active_id,
        date_returned: date_returned
      };

      res.status(200).json({ response: { message: message, results: inventory } });
    } catch (error) {
      console.error('Error adding inventory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}