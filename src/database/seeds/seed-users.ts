import { User } from 'src/modules/users/entities/user';
import { randomUUID } from 'node:crypto';
import { UserType } from 'src/modules/users/entities/user-type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userTypes: UserType[] = [
  {
    id: 1,
    title: 'administrador',
  },
  {
    id: 2,
    title: 'estudante',
  },
];

const users: User[] = [
  {
    id: randomUUID(),
    name: 'John Doe',
    email: 'jonh@doe.com',
    token: randomUUID(),
    user_type_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export async function seedUsers() {
  await prisma.$queryRaw`TRUNCATE TABLE users CASCADE;`;
  await prisma.$queryRaw`TRUNCATE TABLE user_types CASCADE;`;
  await prisma.$queryRaw`ALTER SEQUENCE user_types_id_seq RESTART WITH 1;`;

  await prisma.user_types.createMany({ data: userTypes });

  await prisma.users.createMany({ data: users });

  console.log('users created');
}
