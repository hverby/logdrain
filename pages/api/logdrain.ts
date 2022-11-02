// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {storeLog} from "../../prisma/logdrain";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method == 'POST'){
        const log = await storeLog(req.body);
        res.status(201)
            .json({log});
    }
}