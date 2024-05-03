import { query } from '../../../lib/db';
import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'

const cors = initMiddleware(
  Cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

export default async function handler(req, res) {
  // await cors(req, res)
    const tableName = req.query.tableName;
    const searchQuery = req.query.query;
    const page = req.query.page || 1
    
    const itemPerPage = 5;
  if (req.method === 'GET') {
    try {
      let data;
      let values = [];
        if(searchQuery){
          data = `SELECT * FROM ${tableName} 
          WHERE pc_name LIKE ? OR name LIKE ? OR mac_address LIKE ? OR computer_type LIKE ? LIMIT 5`;
          values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, itemPerPage, (page - 1) * itemPerPage]
        } else {
          data = `SELECT * FROM ${tableName} ORDER BY date_created desc LIMIT ? OFFSET ?`
          values = [itemPerPage, (page - 1) * itemPerPage]
          }
      const [inventory, totalCountRows] = await Promise.all([
        query(data, values),
        query(`SELECT COUNT(*) AS total FROM ${tableName}`)
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
      const pc_name = req.body.pc_name;
      const name = req.body.name;
      const id = req.body.id
      const mac_address = req.body.mac_address;
      const ip_address = req.body.ip_address;
      const computer_type = req.body.computer_type;
      const specs = req.body.specs;
      const monitor = req.body.monitor;
      const department = req.body.department;
      const supplier = req.body.supplier
      const comment = req.body.comment
      const anydesk = req.body.anydesk
      const date_purchased = req.body.date_purchased
      const date_installed = req.body.date_installed
      // if (!pc_name || !mac_address) {
      //   return res.status(400).json({ error: 'Missing required fields' });
      // }
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