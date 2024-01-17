import { database } from '../src/database';

export async function clearDatabase() {
  if (process.env.NODE_ENV !== 'test') return;

  console.log('\nSetup test environment');

  const tableNames: { tablename: string }[] =
    await database.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public' and tablename != '_prisma_migrations';`;

  try {
    for (const { tablename } of tableNames) {
      await database.$queryRawUnsafe(`TRUNCATE table ${tablename} CASCADE;`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await database.$disconnect();
  }
}
