import prisma from "../lib/prisma";
import {formatDate} from "../lib/utils";

export const storeLog = async (logEntry: any) => {
    return await prisma.log.create({
        data: {
            "log": logEntry
        }
    })
}

export const retrieveLogs = async (batchLength: number) => {
    const date: Date = formatDate();
    //const maxDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
    const minDate: Date = formatDate();
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