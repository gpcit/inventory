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
                      WHERE (name LIKE ? OR username LIKE ?)
                      AND is_active_id = 1
                      LIMIT ?
                      OFFSET ?`;
              values = [`%${searchQuery}%`, `%${searchQuery}%`, itemPerPage, (page - 1) * itemPerPage]
            
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
        
        const { name, department, username, password, is_active_id, notes, user_id, user_name, company_name, details, db_table, actions } = req.body

        if (!name || !username) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const duplicateCheck = await query(`SELECT * FROM ${tableName} WHERE username = ?`, [username])
        const seperate = duplicateCheck.map(data => data.username)
        if(duplicateCheck.length > 0){
          return res.status(400).json({ error: `Username is already exists`})
        }
        const addInventory = await query(`INSERT INTO ${tableName} (name, department, username, password, is_active_id, notes) VALUES (?, ?, ?, ?, ?, ?)`, [name, department, username, password, is_active_id, notes],);
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
          name: name,
          department: department,
          username: username,
          password: password,
          is_active_id: is_active_id,
        };
  
        res.status(200).json({ response: { message: message, results: inventory } });
      } catch (error) {
        console.error('Error adding inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}