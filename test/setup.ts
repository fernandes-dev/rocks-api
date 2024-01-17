import { seedContents } from '../src/database/seeds/seed-contents';
import { seedUsers } from '../src/database/seeds/seed-users';
import { clearDatabase } from './clear-database';

module.exports = async () => {
  await clearDatabase();

  await seedContents();

  await seedUsers();
};
