import {prismaMock} from "../singleton";
import {formatDate} from "../lib/utils";
import {storeLogTest, retrieveLogsTest} from "../utils/test-utils/logdrain";


const date = formatDate();
const minDate: Date = formatDate();
const log = {
    id: "000163630457b799cb29a503",
    log: [
        {
            id: "1573817187330377061717300000",
            message: "done",
            timestamp: 1573817187330,
            type: "stdout",
            source: "build",
            projectId: "abcdefgdufoJxB6b9b1fEqr1jUtFkyavUURbnDCFCnZxgs",
            deploymentId: "dpl_233NRGRjVZX1caZrXWtz5g1TAksD",
            buildId: "bld_cotnkcr76",
            host: "example-4lp0kffgq.vercel.app",
            entrypoint: "api/index.js"
        }
    ],
    createdAt: date,
    updatedAt: date
}

test('should create new log', async () => {
    // @ts-ignore
    prismaMock.log.create.mockResolvedValue(log)

    await expect(storeLogTest(log)).resolves.toEqual(log)
})

test('should retrieve logs', async () => {
    // @ts-ignore
    prismaMock.log.findMany.mockReturnValue([log])

    await expect(retrieveLogsTest(1, minDate, date )).resolves.toEqual([log])
})
