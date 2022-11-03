import { PrismaClient } from '@prisma/client'
import {MongoMemoryServer} from "mongodb-memory-server";

const mongoServer = new MongoMemoryServer();
const uri = mongoServer.getUri();
const prismaC = new PrismaClient({
    datasources: {
        db: {
            url: uri,
        },
    },
});

export async function dbClearLogs(){
    return await prismaC.log.deleteMany();
}
export default prismaC

