import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Content } from '../../modules/contents/entities/content';
import { ContentType } from '../../modules/contents/entities/content-type';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const contentTypes: ContentType[] = [
  {
    id: 1,
    title: 'video',
  },
  {
    id: 2,
    title: 'pdf',
  },
  {
    id: 3,
    title: 'image',
  },
];

export async function seedContents(contentsSize = 10) {
  const contents: Content[] = [];
  let currentContentTypeId = 1;

  for (let index = 0; index < contentsSize; index += 1) {
    contents.push({
      id: randomUUID(),
      name: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      content_type_id: currentContentTypeId,
    });

    currentContentTypeId += 1;
    if (currentContentTypeId > 3) currentContentTypeId = 1;
  }

  await prisma.$queryRaw`TRUNCATE TABLE content_types CASCADE;`;
  await prisma.$queryRaw`ALTER SEQUENCE content_types_id_seq RESTART WITH 1;`;

  await prisma.content_types.createMany({ data: contentTypes });

  await prisma.contents.createMany({ data: contents });

  console.log('content created');
}
