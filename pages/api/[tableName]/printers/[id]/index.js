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
        date_installed: date_installed,
        is_active_id: is_active_id,
        date_purchased: date_purchased,
        date_pullout: date_pullout
      };

      res.status(200).json({ response: { message: message, results: inventory } });
    } catch (error) {
      console.error('Error adding inventory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT'){

    try {
      const {id} = req.query;
      const {printer_name, assigned_to, department, manufacturer, model, serial_number, ink_type, description, comment, date_installed, date_purchased, is_active_id, date_pullout, user_id, user_name, company_name, details, db_table, actions, inventory_type} = req.body

      if(!id || !assigned_to){
        return res.status(400).json({ error: 'Missing required fields' })
      }
      const updateResult = await query
      (`UPDATE ${tableName} SET printer_name=?, assigned_to=?, department=?, manufacturer=?, model=?, serial_number=?, ink_type=?, description=?, comment=?, date_installed=?, date_purchased=?, is_active_id=?, date_pullout=? WHERE id=?`,
      [printer_name, assigned_to, department, manufacturer, model, serial_number, ink_type, description, comment, date_installed, date_purchased, is_active_id, date_pullout, id]);
      
      if(updateResult.affectedRows > 0){
        res.status(200).json({response: { message: 'success', updatedItem: id }})
      } else {
        res.status(404).json({ error: 'Item not found or not updated '});
      }
        const addActivityLog = await query(`INSERT INTO activity_log (user_id, user_name, company_name, details, db_table, actions, inventory_type) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, user_name, company_name, details, tableName, actions, inventory_type]);
        
    } catch (error){
      console.error('Error updating inventory: ', error);
      res.status(500).json({ error: 'Internal Server Error'})
    }
  } else if (req.method === 'DELETE') {
    try {
      const {user_id, user_name, company_name, details, db_table, actions, inventory_type } = req.body

      const addActivityLog = await query(`INSERT INTO activity_log (user_id, user_name, company_name, details, db_table, actions, inventory_type) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, user_name, company_name, details, tableName, actions, inventory_type]);
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