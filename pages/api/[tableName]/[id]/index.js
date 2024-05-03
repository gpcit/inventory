import { NextApiRequest, NextApiResponse } from 'next';
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
      const date_purchased = req.body.date_purchased
      const date_installed = req.body.date_installed
      if (!pc_name || !mac_address) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const addInventory = await query(`INSERT INTO ${tableName} (pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed]);
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
      const {pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed} = req.body

      if(!id || !pc_name || !mac_address){
        return res.status(400).json({ error: 'Missing required fields' })
      }
      const updateResult = await query
      (`UPDATE ${tableName} SET pc_name=?, name=?, ip_address=?, mac_address=?, computer_type=?, monitor=?, specs=?, department=?, anydesk=?, supplier=?, comment=?, date_purchased=?, date_installed=? WHERE id=?`,
      [pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, id]);
      
      if(updateResult.affectedRows > 0){
        res.status(200).json({response: { message: 'success', updatedItem: id }})
      } else {
        res.status(404).json({ error: 'Item not found or not updated '});
      }
    } catch (error){
      console.error('Error updating inventory: ', error);
      res.status(500).json({ error: 'Internal Server Error'})
    }
  } else {
    res.status(405).json({ error: 'Method not allowed '})
  }

  
}

// else if (req.method === 'PUT'){

//   try {
//     const {id} = req.query;
//     const {pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased} = req.body

//     if(!id || !pc_name || !mac_address){
//       return res.status(400).json({ error: 'Missing required fields' })
//     }
//     const updateResult = await query
//     (`UPDATE ${tableName} SET pc_name=?, name=?, ip_address=?, mac_address=?, computer_type=?, monitor=?, specs=?, department=?, anydesk=?, supplier=?, comment=?, date_purchased=? WHERE id=?`,
//     [pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, id]);

//     if(updateResult.affectedRows > 0){
//       res.status(200).json({ message: 'success', updatedItem: id })
//     } else {
//       res.status(404).json({ error: 'Item not found or not updated '});
//     }
//   } catch (error){
//     console.error('Error updating inventory: ', error);
//     res.status(500).json({ error: 'Internal Server Error'})
//   }
// } else {
//   res.status(405).json({ error: 'Method not allowed '})
// }