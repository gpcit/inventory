// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '@/lib/auth'; // Ensure this is correctly implemented
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);

    console.log("Result for user: ", user)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Authenticated User:', user); // Log the user data

    // Create a JWT token
    const token = sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    console.log("Result for token: ", token)

    // Set the JWT as a cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    }));

    res.status(200).json({ message: 'Login successful' });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message });
  }
};

export default login;
