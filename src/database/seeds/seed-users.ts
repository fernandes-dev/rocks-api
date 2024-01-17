import { User } from '../../modules/users/entities/user';
import { randomUUID } from 'node:crypto';
import { UserType } from '../../modules/users/entities/user-type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userTokens = {
  admin: '61da0367-ac73-4c95-924a-59d5bfa9a9dc',
  student: '778b5d54-3c30-4ead-b0db-b2c3143457e3',
};

export const userTypes: UserType[] = [
  {
    id: 1,
    title: 'administrador',
  },
  {
    id: 2,
    title: 'estudante',
  },
];

export const users: User[] = [
  {
    id: randomUUID(),
    name: 'John Doe Admin',
    email: 'jonhdoe@admin.com',
    token: userTokens.admin,
    user_type_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'John Doe Student',
    email: 'jonhdoe@student.com',
    token: userTokens.student,
    user_type_id: 2,
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
