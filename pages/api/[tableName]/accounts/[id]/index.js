import { query } from '@/lib/db';

export default async function handler(req, res) {
    const tableName = req.query.tableName;
    const {id} = req.query
    if (req.method === 'GET') {
      try {
          if (id) { // If ID is provided, fetch specific data
              const data = `SELECT * FROM ${tableName} WHERE id = ?`;
              const values = [id];
              const account = await query(data, values);

              if (account.length === 0) {
                  return res.status(404).json({ error: 'Account not found' });
              }
              res.status(200).json({ results: account });
            //   console.log(id)
            //   console.log({results: inventory})
          }
      } catch (error) {
          
          res.status(500).json({ error: 'Internal Server Error' });
      }
  } else if (req.method === 'POST') {
    try {
      const name = req.body.name;
      const department = req.body.department
      const username = req.body.username;
      const password = req.body.password;
      const is_active_id = req.body.is_active_id;
      const notes = req.body.notes;
      
      if (!name || !username) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const duplicateCheck = await query(`SELECT * FROM ${tableName} WHERE username = ?`, [username])
      const seperate = duplicateCheck.map(data => data.username)
      if(duplicateCheck.length > 0){
        return res.status(400).json({ error: `Username is already exists`})
      }
      const addInventory = await query(`INSERT INTO ${tableName} (name, department, username, password, is_active_id, notes) VALUES (?, ?, ?, ?, ?)`, [name, department, username, password, is_active_id, notes],);
      let message;
      if (addInventory.insertId) {
        message = 'success';
      } else {
        message = 'failed';
      }
      let inventory = {
        id: addInventory.insertId,
        name: name,
        department: department,
        username: username,
        password: password,
        is_active_id: is_active_id,
        notes: notes
      };

      res.status(200).json({ response: { message: message, results: inventory } });
    } catch (error) {
      console.error('Error adding inventory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT'){

    try {
      const {id} = req.query;
      const {name, department, username, password, is_active_id, notes, user_id, user_name, company_name, details, db_table, actions } = req.body

      if(!id || !name || !username){
        return res.status(400).json({ error: 'Missing required fields' })
      }
      const updateResult = await query
      (`UPDATE ${tableName} SET name=?, department=?, username=?, password=?, is_active_id=?, notes=? WHERE id=?`,
      [name, department, username, password, is_active_id, notes, id]);
      
      if(updateResult.affectedRows > 0){
        res.status(200).json({response: { message: 'success', updatedItem: id }})
      } else {
        res.status(404).json({ error: 'Data not found or not updated '});
      }
      const addActivityLog = await query(`INSERT INTO activity_log (user_id, user_name, company_name, details, db_table, actions) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, user_name, company_name, details, tableName, actions]);
      
    } catch (error){
      console.error('Error updating inventory: ', error);
      res.status(500).json({ error: 'Internal Server Error'})
    }
  } else if (req.method === 'DELETE') {
    try {
      const {user_id, user_name, company_name, details, db_table, actions } = req.body

      const addActivityLog = await query(`INSERT INTO activity_log (user_id, user_name, company_name, details, db_table, actions) VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, user_name, company_name, details, tableName, actions]);

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