import prisma from "../lib/prisma";

export const storeLog = async (logEntry: any) => {
    return await prisma.log.create({
        data: {
            "log": logEntry
        }
    })
}

export const storeBeacon = async (beaconEntry: any) => {
    return await prisma.beacon.create({
        data: {
            "beacon": beaconEntry
        }
    })
}

export const retrieveLogs = async (batchLength: number, minDate: Date, date: Date) => {
    minDate.setDate(date.getDate() - batchLength);
    return await prisma.log.findMany({
        where: {
            createdAt: {
                lt: date,
                gte: minDate
            },
        }
    });
}

export const retrieveBeacons = async (batchLength: number, minDate: Date, date: Date) => {
    minDate.setDate(date.getDate() - batchLength);
    return await prisma.beacon.findMany({
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

export const deleteBeacons = async (batchLength: number, minDate: Date, date: Date) => {
    minDate.setDate(date.getDate() - batchLength);
    return await prisma.beacon.deleteMany({
        where: {
            createdAt: {
                lt: date,
                gte: minDate
            },
        }
    });
}