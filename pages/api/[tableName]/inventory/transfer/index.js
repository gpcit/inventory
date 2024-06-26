import { query } from '@/lib/db';

export default async function handler(req, res) {
    const tableName = req.query.tableName;
   
    if (req.method === 'GET') {
      try {
           // If ID is provided, fetch specific data
              const data = `SELECT * FROM ${tableName}`;
              const values = [id];
              const inventory = await query(data);

              if (inventory.length === 0) {
                  return res.status(404).json({ error: 'Inventory not found' });
              }
              res.status(200).json({ results: inventory });
            //   console.log(id)
            console.log("Result for id: ", id)
          
      } catch (error) {
          
          res.status(500).json({ error: 'Internal Server Error' });
      }
  } else if (req.method === 'POST') {
    try {

    const { pc_name, name, mac_address, ip_address, computer_type, specs, monitor, department, supplier, comment, anydesk, is_active_id, date_purchased, date_pullout, date_installed, user_id, user_name, company_name, details, db_table, actions, inventory_type, uid } = req.body

    const addInventory = await query(`INSERT INTO ${db_table} (pc_name, name, mac_address, ip_address, computer_type, specs, monitor, department, supplier, comment, anydesk, is_active_id, date_purchased, date_pullout, date_installed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [ pc_name, name, mac_address, ip_address, computer_type, specs, monitor, department, supplier, comment, anydesk, is_active_id, date_purchased, date_pullout, date_installed],);

    let message;

    if (addInventory.insertId) {
    message = 'success';
    } else {
    message = 'failed';
    }

    const remoteData = await query(`DELETE FROM ${tableName} WHERE id=?`, [uid])
    // if(remoteData.affectedRows > 0) {
    //   res.status(200).json({ response: { message: 'success', deletedItem: uid } })
    // } else {
    //   res.status(404).json({ error: 'Item not found or not deleted' })
    // }
    const addActivityLog = await query(`INSERT INTO activity_log (user_id, user_name, company_name, details, db_table, actions, inventory_type) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user_id, user_name, company_name, details, db_table, actions, inventory_type]);

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
        date_purchased: date_purchased,
        date_pullout: date_pullout,
        date_installed: date_installed
    };

      res.status(200).json({ response: { message: message, results: inventory } });
    } catch (error) {
      console.error('Error adding inventory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}