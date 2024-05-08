import { NextResponse } from 'next/server';
import util from "util"
import db from "../../../../util/db"


const query = util.promisify(db.query).bind(db)

export const POST = async (req, res) => {
    const user = await req.body
    console.log(user)
    try {
        const results = await query(`INSERT INTO users (uid, email, username, password, type_account) VALUES (UUID(), '${user.email}', '${user.username}', '${user.password}', 'user-personal')`)
        if(results.affectedRows > 0) {
            res.status(201).json({result: user})
        } else {
            throw new Error('Failed to insert user')
        }
    } catch (error) {
        console.error('Error: ', error)
        res.status(400).json({ error: 'Failed to insert'})
    }
}

