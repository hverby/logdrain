import type { NextApiRequest, NextApiResponse } from 'next'
import {storeLog, storeBeacon} from "../../prisma/logdrain";
import {Prisma} from "@prisma/client";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method == 'POST'){
        if (
            req.body &&
            typeof req.body === 'object'
        ){
            const beacon = await storeBeacon(req.body);
            res.status(201)
                .json({beacon});
        }else{
            res.status(500)
                .json({message: "Format not supported!"});
        }
    }
}