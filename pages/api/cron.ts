// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {deleteBeacons, deleteLogs, retrieveBeacons, retrieveLogs} from "../../prisma/logdrain";
import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import {s3Client} from "../../lib/s3Client";
import { Prisma } from '@prisma/client';
import {formatDate, formatDateString, sources} from "../../lib/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method == 'POST') {
        let {batchLength, deleteAfter} = req.body; // Get length of the batch and if we may delete all the records after migration to s3. For example, 1 for one day.
        const { authorization } = req.headers;
        if(!batchLength || batchLength <= 0) batchLength = 1;
        if(!deleteAfter) deleteAfter = true;
        console.log(deleteAfter);
        console.log(batchLength);
        if(authorization === `Bearer ${process.env.API_SECRET_KEY}`){
            let responseObj = {
                S3LogUpload: "",
                S3BeaconUpload: "",
                DeleteLogs: "",
                DeleteBeacons: "",
                RetrieveLogs: "",
                RetrieveBeacons: ""
            };
            const date: Date = formatDate();
            const minDate: Date = formatDate();
            const result = await retrieveLogs(Number(batchLength), minDate, date); // Get all logs for the same day.
            responseObj.RetrieveLogs =  "Retrieve success!";
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
                    try {
                        // @ts-ignore
                        for (const source of s3Map.keys()) {
                            // we create a s3 file to upload
                            await s3Client.send(new PutObjectCommand({
                                Bucket: process.env.S3_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
                                Key: `${source}-${formatDateString(date)}.txt`, // The name of the object. For example, 'sample_upload.txt'.
                                Body: JSON.stringify(s3Map.get(source)), // The content of the object. For example, 'Hello world!".
                            }));
                        }
                        responseObj.S3LogUpload = "Upload success!";
                        if(deleteAfter){
                            try{
                                await deleteLogs(Number(batchLength), minDate, date);
                                responseObj.DeleteLogs = "Deletion success!";
                            } catch (err){
                                responseObj.DeleteLogs = `${err}`;
                            }
                        }else{
                            responseObj.DeleteLogs = "Not required!";
                        }
                    } catch (err) {
                        responseObj.S3LogUpload = `${err}`;
                    }
                }else{
                    responseObj.S3LogUpload =  "Nothing to upload!";
                }

                //Uploads the beacons
                try {
                    const result = await retrieveBeacons(Number(batchLength), minDate, date);
                    responseObj.RetrieveBeacons =  "Retrieve success!";
                    if(result.length > 0){
                        try {
                            // we create a s3 file to upload
                            await s3Client.send(new PutObjectCommand({
                                Bucket: process.env.S3_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
                                Key: `client-${formatDateString(date)}.txt`, // The name of the object. For example, 'sample_upload.txt'.
                                Body: JSON.stringify(result), // The content of the object. For example, 'Hello world!".
                            }));

                            responseObj.S3BeaconUpload =  "Upload success!";
                            //If we plan to delete all the beacons migrated to s3 from our DB.
                            if(deleteAfter){
                                try{
                                    await deleteBeacons(Number(batchLength), minDate, date);
                                    responseObj.DeleteBeacons =  "Deletion success!";
                                } catch (err){
                                    responseObj.DeleteBeacons =  `${err}`;
                                }
                            }else{
                                responseObj.DeleteBeacons =  "Not required!";
                            }
                        } catch (err) {
                            responseObj.S3BeaconUpload =  `${err}`;
                        }
                    }else{
                        responseObj.S3BeaconUpload =   "Nothing to upload!"
                    }
                }catch (err){
                    responseObj.RetrieveBeacons =  `${err}`;
                }
                res.status(201)
                    .json(responseObj);
            } catch (err) {
                res.status(500)
                    .json(responseObj);
            }
        }else{
            res.status(500)
                .json({message: "Authorization denied!"});
        }
    }else {
         res.setHeader('Allow', 'POST');
         res.status(405).end('Method Not Allowed');
    }
}
