This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm i
npm run dev
```
## Set environement variables

- DATABASE_URL=''
- API_SECRET_KEY=''
- S3_KEY=''
- S3_SECRET=''
- S3_BUCKET=''
- REGION=''

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How it works

This is Logdrain app (api):

- Url to receive messages from navigator.sendBeacon : https://{host}/api/sendbeacon

- Url to receive the logs : (POST) https://{host}/api/logdrain.

- Url to ulpoad the logs to S3 : (POST) https://{host}/api/cron.
  - This url is called by an cron job each day, 60 seconds after midnight GMT.

  This url must be call with:
   {
    "batchLength": 1,
    "deleteAfter": true
   }
   
 - batchLength: For the length of the batch, can be 1 for one day or 2, 3 ... If we want to retrieve previous day's logs.
 - deleteAfter: Set to true if you want to delete the logs after migration to S3.
 - Default values are set to 1 for batchLength and true for deleteAfter.
