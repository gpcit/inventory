import { query } from "@/lib/db";

export default async function Login(req, res) {
    if(req.method === 'POST') {
        try {
            const {username, password} = req.body
            const result = await query(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password])
            
            console.log("THIS IS THE RESULTS: ", result)
            if(result && Array.isArray(result) && result.length > 0) {
                return res.status(200).json(result[0])
            } else {
                return res.status(404).json({ error: 'Incorrect Username or Password'})
            }
                
        } catch (error) {
            console.error('Unable to fetch users: ', error)
            throw new Error('Error failed')
        }
    } else {
        return res.status(405).json({ error: 'Method not Allowed' })
    }
}