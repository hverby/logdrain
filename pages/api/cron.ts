// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {retrieveLogs} from "../../prisma/logdrain";
import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import {s3Client} from "../../lib/s3Client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Set the parameters
    const params = {
        Bucket: process.env.S3_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: "KEY", // The name of the object. For example, 'sample_upload.txt'.
        Body: "BODY", // The content of the object. For example, 'Hello world!".
    };

    if(req.method == 'GET'){
        const { length, env } = req.query;
       const result = await retrieveLogs(1);
        res.status(201)
            .json({result});
    }
}
