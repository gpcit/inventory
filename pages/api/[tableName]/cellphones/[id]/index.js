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
      const assigned_to = req.body.assigned_to;
      const department = req.body.department
      const brand = req.body.brand;
      const model_specs = req.body.model_specs;
      const imei = req.body.imei;
      const number = req.body.number;
      const email_password = req.body.email_password;
      const serial_number = req.body.serial_number
      const inclusion = req.body.inclusion
      const comment = req.body.comment
      const date_issued = req.body.date_issued
      const date_purchased = req.body.date_purchased
      const is_active_id = req.body.is_active_id
      if (!assigned_to || !brand) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const addInventory = await query(`INSERT INTO ${tableName} (assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, comment, date_issued, date_purchased, is_active_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, date_issued, date_purchased, is_active_id],);
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
        date_purchased: date_purchased,
        is_active_id: is_active_id,
      };

      res.status(200).json({ response: { message: message, results: inventory } });
    } catch (error) {
      console.error('Error adding inventory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT'){

    try {
      const {id} = req.query;
      const {assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, comment, date_issued, date_purchased, is_active_id} = req.body

      if(!id || !assigned_to || !brand){
        return res.status(400).json({ error: 'Missing required fields' })
      }
      const updateResult = await query
      (`UPDATE ${tableName} SET assigned_to=?, department=?, brand=?, model_specs=?, serial_number=?, imei=?, number=?, email_password=?,  inclusion=?, comment=?, date_issued=?, date_purchased=?, is_active_id=? WHERE id=?`,
      [assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, comment, date_issued, date_purchased, is_active_id, id]);
      
      if(updateResult.affectedRows > 0){
        res.status(200).json({response: { message: 'success', updatedItem: id }})
      } else {
        res.status(404).json({ error: 'Item not found or not updated '});
      }
    } catch (error){
      console.error('Error updating inventory: ', error);
      res.status(500).json({ error: 'Internal Server Error'})
    }
  } else if (req.method === 'DELETE') {
    try {
      if (!id) {
        return res.status(400).json({ error: 'Unable to delete'})
      }
      const deleteResult = await query(`DELETE FROM ${tableName} WHERE id=?`, [id])
      if(deleteResult.affectedRows > 0) {
        res.status(200).json({ response: { message: 'success', deletedItem: id } })
      } else {
        res.status(404).json({ error: 'Item not found or not deleted' })
      }
    } catch (error) {
      console.error('Error deleting Inventory: ',error)
      res.status(500).json({ error: 'Internal server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed '})
  }
}