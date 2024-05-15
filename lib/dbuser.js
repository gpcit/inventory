import mysql from 'mysql2/promise';

export async function getUserByUsername(username) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    const [results] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    return results.length ? results[0] : null;
  } catch (error) {
    console.error('Error querying user by username:', error.message);
    throw new Error('Failed to retrieve user');
  } finally {
    await connection.end();
  }
}
