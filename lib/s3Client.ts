import { S3Client } from '@aws-sdk/client-s3';

// Creates S3 client
const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        // @ts-ignore
        accessKeyId: process.env.S3_KEY,
        // @ts-ignore
        secretAccessKey: process.env.S3_SECRET,
    },
});
export { s3Client };