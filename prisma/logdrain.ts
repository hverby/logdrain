import prisma from "../lib/prisma";
import {formatDate} from "../lib/utils";

export const storeLog = async (logEntry: any) => {
    return await prisma.log.create({
        data: {
            "log": logEntry
        }
    })
}

export const retrieveLogs = async (batchLength: number, minDate: Date, date: Date) => {
    minDate.setDate(date.getDate() - batchLength);
    console.log(date);
    console.log(minDate);

    return await prisma.log.findMany({
        where: {
            createdAt: {
                lt: date,
                gte: minDate
            },
        }
    });
}

export const deleteLogs = async (batchLength: number, minDate: Date, date: Date) => {
    minDate.setDate(date.getDate() - batchLength);
    return await prisma.log.deleteMany({
        where: {
            createdAt: {
                lt: date,
                gte: minDate
            },
        }
    });
}