import { Test, TestingModule } from '@nestjs/testing';
import { ContentsService } from './contents.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ContentsModule } from './contents.module';
import { PrismaModule } from '../../database/prisma.module';
import { AppService } from '../../app.service';
import { Content } from './entities/content';
import { ContentType } from './entities/content-type';
import { faker } from '@faker-js/faker';

describe('contents service unit tests', () => {
  let contentsService: ContentsService;

  let content: Content;
  let contentType: ContentType;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
        ContentsModule,
        PrismaModule,
      ],
      providers: [AppService],
    }).compile();

    contentsService = app.get<ContentsService>(ContentsService);

    contentType = await contentsService.createContentType('image');

    content = await contentsService.createContent({
      content_type_id: contentType.id,
      description: faker.lorem.paragraph(),
      name: faker.lorem.word(),
    });
  });

  it(' should be able to get content by id', async () => {
    const foundContent = await contentsService.getContent(content.id);

    expect(foundContent.id).toBe(content.id);
    expect(foundContent.name).toBe(content.name);
    expect(foundContent.description).toBe(content.description);
  });

  it(' should be able to get contents by ids', async () => {
    const foundContents = await contentsService.getContents({
      ids: [content.id],
    });

    expect(foundContents.length).toBe(1);
  });

  it(' should be able to get contents by description', async () => {
    const foundContents = await contentsService.getContents({
      description: content.description,
    });

    expect(foundContents.length).toBe(1);
  });

  it(' should be able to get contents by name', async () => {
    const foundContents = await contentsService.getContents({
      name: content.name,
    });

    expect(foundContents.length).toBe(1);
  });

  it(' should be able to get contents by content_type_ids', async () => {
    const foundContents = await contentsService.getContents({
      content_type_ids: [content.content_type_id],
    });

    expect(foundContents.length > 0).toBe(true);
  });

  it(' should be able to create content', async () => {
    const content = await contentsService.createContent({
      content_type_id: contentType.id,
      description: faker.lorem.paragraphs(),
      name: faker.word.adjective(),
    });

    expect(content).toHaveProperty('id');
  });

  it(' should be able to update content', async () => {
    const content = await contentsService.createContent({
      content_type_id: contentType.id,
      description: faker.lorem.paragraphs(),
      name: faker.word.adjective(),
    });

    expect(content).toHaveProperty('id');

    const updatedContent = await contentsService.updateContent({
      id: content.id,
      name: faker.word.adjective(),
    });

    expect(updatedContent.description).toBe(content.description);
    expect(updatedContent.name).not.toBe(content.name);
  });

  it(' should be able to delete content', async () => {
    const content = await contentsService.createContent({
      content_type_id: contentType.id,
      description: faker.lorem.paragraphs(),
      name: faker.word.adjective(),
    });

    expect(content).toHaveProperty('id');

    await contentsService.deleteContent(content.id);

    const foundContent = await contentsService.getContent(content.id);

    expect(foundContent).toBeFalsy();
  });
});
