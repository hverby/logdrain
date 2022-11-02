import type { NextApiRequest, NextApiResponse } from 'next'
import {storeLog} from "../../prisma/logdrain";
import {Prisma} from "@prisma/client";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method == 'POST'){

    }
}