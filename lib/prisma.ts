/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
// The Prisma 7 TS client uses a custom output path
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient: _PC } = require('../app/generated/prisma/client');

const dbUrl = (process.env.DATABASE_URL ?? 'file:./prisma/dev.db').replace('file:', '');

type PrismaClientType = InstanceType<typeof _PC>;

function createClient(): PrismaClientType {
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  return new _PC({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientType };
export const prisma: PrismaClientType = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
