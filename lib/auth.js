import { query } from './db';
import { compare } from 'bcryptjs'; // Ensure bcryptjs is installed

export async function authenticateUser(username, password) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const users = await query(sql, [username]);

    if (users.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = users[0];
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }
    console.log("Result for user: ", user)
    return user;
}
