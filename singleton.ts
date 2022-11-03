import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prismaC from "./utils/test-utils/client";

jest.mock('./utils/test-utils/client', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
    mockReset(prismaMock)
})

export const prismaMock = prismaC as unknown as DeepMockProxy<PrismaClient>