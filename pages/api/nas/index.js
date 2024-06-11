import { query } from '@/lib/db';
import ping from 'ping';

export default async function handler(req, res) {
  const { ip } = req.query;

  if (!ip || typeof ip !== 'string') {
    res.status(400).json({ message: 'IP address is required' });
    return;
  }

  try {
      const response = await ping.promise.probe(ip);
      res.status(200).json({ ip, online: response.alive })
    
  } catch (error) {
    res.status(500).json({ message: 'Error pinging the IP address', error });
  }

  
};
