import { query } from '../../../lib/db';


export default async function handler(req, res) {
  // await cors(req, res)
    const tableName = req.query.tableName;
    const searchQuery = req.query.query;
    const page = req.query.page || 1
    
    const itemPerPage = 5;
  if (req.method === 'GET') {
    try {
      let data;
      let pageTotal;
      let values = [];
        if(searchQuery){
          pageTotal = `SELECT COUNT(*) AS total FROM ${tableName} WHERE is_active_id = 2`
          data = `SELECT * FROM ${tableName} 
                  WHERE (pc_name LIKE ? OR name LIKE ? OR mac_address LIKE ?  OR computer_type LIKE ?) 
                  AND is_active_id = 2
                  LIMIT ?
                  OFFSET ?`;
          values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, itemPerPage, (page - 1) * itemPerPage]
        } else {
          pageTotal = `SELECT COUNT(*) as total FROM ${tableName} WHERE is_active_id = 2`
          data = `SELECT * FROM ${tableName} WHERE is_active_id = 2 ORDER BY date_created desc LIMIT ? OFFSET ?`
          values = [itemPerPage, (page - 1) * itemPerPage]
          }
      const [inventory, totalCountRows] = await Promise.all([
        query(data, values),
        query(pageTotal)
      ]);
      const totalCount = totalCountRows[0].total;
      const totalPages = Math.ceil(totalCount / itemPerPage);
      
      res.status(200).json({ results: inventory, totalPages});
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ error: 'Internal Server Errors' });
    }
  } else if (req.method === 'POST') {
    try {
      const { pc_name, name, id, mac_address, ip_address, computer_type, specs, monitor, department, supplier, comment, anydesk, is_active_id, date_purchased, date_pullout, date_installed, user_id, user_name, company_name, details, db_table, actions, inventory_type } = req.body
      // if (!pc_name || !mac_address) {
      //   return res.status(400).json({ error: 'Missing required fields' });
      // }
      const addInventory = await query(`INSERT INTO ${tableName} (pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, date_pullout, is_active_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, date_pullout, is_active_id]);
      console.log("this will be shown if success: ",addInventory.insertId)
      let message;
      if (addInventory.insertId) {
        
        message = 'success';
      } else {
        message = 'failed';
      }

      const addActivityLog = await query(`INSERT INTO activity_log (user_id, user_name, company_name, details, db_table, actions, inventory_type) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, user_name, company_name, details, tableName, actions, inventory_type]);

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
  } else if (req.method === 'PUT'){

    try {
      const {id} = req.query;
      const {pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, date_pullout, is_active_id} = req.body

      if(!id || !pc_name || !mac_address){
        return res.status(400).json({ error: 'Missing required fields' })
      }
      const updateResult = await query
      (`UPDATE ${tableName} SET pc_name=?, name=?, ip_address=?, mac_address=?, computer_type=?, monitor=?, specs=?, department=?, anydesk=?, supplier=?, comment=?, date_purchased=?, date_installed=?, date_pullout=?, is_active_id WHERE id=?`,
      [pc_name, name, ip_address, mac_address, computer_type, monitor, specs, department, anydesk, supplier, comment, date_purchased, date_installed, date_pullout, is_active_id, id]);

      if(updateResult.affectedRows > 0){
        res.status(200).json({ message: 'success', updatedItem: id })
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