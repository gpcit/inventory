import { NextApiRequest, NextApiResponse } from "next";

type MiddlewareFunction = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export default function initMiddleware(middleware: MiddlewareFunction) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await middleware(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
