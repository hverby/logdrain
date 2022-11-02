import { S3Client } from '@aws-sdk/client-s3';

// Creates S3 client
const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        // @ts-ignore
        accessKeyId: process.env.ACCESS_KEY,
        // @ts-ignore
        secretAccessKey: process.env.SECRET_KEY,
    },
});
export { s3Client };