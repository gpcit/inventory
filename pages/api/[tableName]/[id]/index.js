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
      const pc_name = req.body.pc_name;
      const name = req.body.name;
      const id = req.body.id
      const mac_address = req.body.mac_address;
      const ip_address = req.body.id_address;
      const monitor = req.body.monitor;
      const computer_type = req.body.computer_type;
      const specs = req.body.specs;
      const supplier = req.body.supplier
      const anydesk = req.body.anydesk
      const comment = req.body.comment
      const is_active_id = req.body.is_active_id
      const date_purchased = req.body.date_purchased
      const date_pullout = req.body.date_pullout
      const date_installed = req.body.date_installed
      if (!pc_name || !mac_address) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const addInventory = await query(`INSERT INTO ${tableName} (pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, date_pullout, is_active_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, date_pullout, is_active_id]);
      console.log("this will be shown if success: ",addInventory.insertId)
      let message;
      if (addInventory.insertId) {
        message = 'success';
      } else {
        message = 'failed';
      }

      let inventory = {
        id: addInventory.insertId,
        pc_name: pc_name,
        name: name,
        ip_address: ip_address,
        mac_address: mac_address,
        computer_type: computer_type,
        monitor: monitor,
        specs: specs,
        department: department,
        anydesk: anydesk,
        supplier: supplier,
        comment: comment,
        is_active_id: is_active_id,
        date_pullout: date_pullout,
        date_purchased: date_purchased,
        date_installed: date_installed
      };

      res.status(200).json({ response: { message: message, results: inventory } });
    } catch (error) {
      console.error('Error adding inventory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT'){

    try {
      const {id} = req.query;
      const {pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, date_pullout, is_active_id, user_id, user_name, company_name, details, db_table, actions, inventory_type} = req.body

      if(!id || !pc_name || !mac_address){
        return res.status(400).json({ error: 'Missing required fields' })
      }
      const updateResult = await query
      (`UPDATE ${tableName} SET pc_name=?, name=?, ip_address=?, mac_address=?, computer_type=?, monitor=?, specs=?, department=?, anydesk=?, supplier=?, comment=?, date_purchased=?, date_installed=?, date_pullout=?, is_active_id=? WHERE id=?`,
      [pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, date_pullout, is_active_id, id]);
      
      if(updateResult.affectedRows > 0){
        res.status(200).json({response: { message: 'success', updatedItem: id }})
      } else {
        res.status(404).json({ error: 'Item not found or not updated '});
      }
    
      // add details to activity log when edit the data
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
      console.error('Error deleting Account: ',error)
      res.status(500).json({ error: 'Internal server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed '})
  }

  
}
