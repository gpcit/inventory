import { NextApiRequest, NextApiResponse } from 'next';

export const isAuthenticated = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Example: Check if session cookie is present and valid
    const sessionCookie = req.cookies['session-id'];

    if (!sessionCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Proceed to protected route handler
    await handler(req, res);
  };
};
