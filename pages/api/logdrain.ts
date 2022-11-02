// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {storeLog} from "../../prisma/logdrain";
import {Prisma} from "@prisma/client";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method == 'POST'){
        if (
            req.body &&
            typeof req.body === 'object' &&
            Array.isArray(req.body)
        ){
            const log = await storeLog(req.body);
            res.status(201)
                .json({log});
        }else{
            res.status(500)
                .json({message: "Format not supported!"});
        }
    }
}