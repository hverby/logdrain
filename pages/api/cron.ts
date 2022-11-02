// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {deleteLogs, retrieveLogs} from "../../prisma/logdrain";
import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import {s3Client} from "../../lib/s3Client";
import { Prisma } from '@prisma/client';
import {formatDate, formatDateString, sources} from "../../lib/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method == 'GET') {
        const {length, deleteAfter} = req.query; // Get length of the batch and if we may delete all the records after migration to s3. For example, 1 for one day.
        const date: Date = formatDate();
        const minDate: Date = formatDate();
        const result = await retrieveLogs(Number(length), minDate, date); // Get all logs for the same day.
        let s3Map = new Map<String, Prisma.JsonObject[]>(); // create an amp for our different arrays of log.
        sources.forEach((source) => {
            const tmpArr: Prisma.JsonObject[] = [];
            result.forEach((l: any) => {
                //Filter a log by its source.
                if(((l.log as Prisma.JsonArray)[0] as Prisma.JsonObject)["source"] == source){
                    //Add all same log (by its source) together
                    tmpArr.push(l.log);
                }
            })
            //Ensure that we'll haven't an empty log array to upload to s3
            if(tmpArr.length > 0){
                s3Map.set(source, tmpArr) ;
            }
        })

        try {
            // for each of our sources recorded
            if((Array.from(s3Map.keys())).length > 0){
                // @ts-ignore
                for (const source of s3Map.keys()) {
                    // we create a s3 file to upload
                    await s3Client.send(new PutObjectCommand({
                        Bucket: process.env.S3_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
                        Key: `${source}-${formatDateString(date)}.txt`, // The name of the object. For example, 'sample_upload.txt'.
                        Body: JSON.stringify(s3Map.get(source)), // The content of the object. For example, 'Hello world!".
                    }));
                    /*console.log(
                        "Successfully created " +
                        `${source}-${formatDateString(date)}.txt` +
                        " and uploaded it to " +
                        process.env.S3_BUCKET
                    );*/
                }
                //Just for test purpose
                //If we don't delete all the logs migrated to s3 from our DB.
                if(deleteAfter == "true"){
                    try{
                        await deleteLogs(Number(length), minDate, date);
                        res.status(201)
                            .json({result: 'Success!'});
                    } catch (err){
                        res.status(500)
                            .json({error: err});
                    }
                }else{
                    res.status(201)
                        .json({result: 'Success without deletion!'});
                }
            }else{
                res.status(201)
                    .json({result: 'Nothing to upload!'});
            }
        } catch (err) {
            res.status(500)
                .json({error: err});
        }
    }
}
