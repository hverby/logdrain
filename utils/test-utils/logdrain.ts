import prismaC from "./client";

export const storeLogTest = async (logEntry: any) => {
    return await prismaC.log.create({
        data: logEntry
    })
}

export const retrieveLogsTest = async (batchLength: number, minDate: Date, date: Date) => {
    minDate.setDate(date.getDate() - batchLength);
    return await prismaC.log.findMany({
        where: {
            createdAt: {
                lt: date,
                gte: minDate
            },
        }
    });
}