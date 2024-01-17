import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { AppService } from '../../app.service';
import { PrismaModule } from '../../database/prisma.module';
import { ContentsModule } from './contents.module';
import { ContentsService } from './contents.service';
import { join } from 'path';
import { Content } from './entities/content';
import { ContentType } from './entities/content-type';
import { ContentsResolver } from './contents.resolver';
import { userTokens } from '../../database/seeds/seed-users';
import { ContentsRepository } from './contents.repository';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';

describe('contents resolver e2e', () => {
  let contentsService: ContentsService;

  let contentsResolver: ContentsResolver;

  let contentsRepository: ContentsRepository;

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

    contentsResolver = app.get<ContentsResolver>(ContentsResolver);

    contentsRepository = app.get<ContentsRepository>(ContentsRepository);

    contentType = await contentsService.createContentType('image');

    content = await contentsService.createContent({
      content_type_id: contentType.id,
      description: 'test' + Math.random().toString(),
      name: 'test' + Math.random().toString(),
    });
  });

  it(' should be able to get content and views count by id with student token', async () => {
    const contentWithoutViews = await contentsRepository.getContent(content.id);

    expect(contentWithoutViews._count.content_views).toBe(0);

    const foundContent = await contentsResolver.getContent(
      { id: content.id },
      { req: { headers: { authorization: `Bearer ${userTokens.student}` } } },
    );

    expect(foundContent._count.content_views).toBe(1);
    expect(foundContent.id).toBe(content.id);
    expect(foundContent.name).toBe(content.name);
    expect(foundContent.description).toBe(content.description);
  });

  it(' should be able to create content with admin token', async () => {
    const newContent = await contentsResolver.createContent(
      {
        content_type_id: contentType.id,
        description: faker.lorem.paragraphs(),
        name: faker.word.adjective(),
      },
      {
        req: { headers: { authorization: `Bearer ${userTokens.admin}` } },
      },
    );

    expect(newContent).toHaveProperty('id');
  });

  it(' should not be able to create content with student token', async () => {
    await expect(async () => {
      await contentsResolver.createContent(
        {
          content_type_id: contentType.id,
          description: faker.lorem.paragraphs(),
          name: faker.word.adjective(),
        },
        {
          req: { headers: { authorization: `Bearer ${userTokens.student}` } },
        },
      );
    }).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it(' should be able to update content with admin token', async () => {
    const updatedContent = await contentsResolver.updateContent(
      {
        name: faker.word.adjective(),
        id: content.id,
      },
      {
        req: { headers: { authorization: `Bearer ${userTokens.admin}` } },
      },
    );

    expect(updatedContent.description).toBe(content.description);
    expect(updatedContent.name).not.toBe(content.name);
  });

  it(' should not be able to update content with student token', async () => {
    await expect(async () => {
      await contentsResolver.updateContent(
        {
          name: faker.word.adjective(),
          id: content.id,
        },
        {
          req: { headers: { authorization: `Bearer ${userTokens.student}` } },
        },
      );
    }).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it(' should be able to delete content with admin token', async () => {
    const newContent = await contentsResolver.createContent(
      {
        content_type_id: contentType.id,
        description: faker.lorem.paragraphs(),
        name: faker.word.adjective(),
      },
      {
        req: { headers: { authorization: `Bearer ${userTokens.admin}` } },
      },
    );

    await contentsResolver.deleteContent(newContent.id, {
      req: { headers: { authorization: `Bearer ${userTokens.admin}` } },
    });

    const foundContent = await contentsService.getContent(newContent.id);

    expect(foundContent).toBeFalsy();
  });

  it(' should not be able to delete content with student token', async () => {
    await expect(async () => {
      await contentsResolver.deleteContent(content.id, {
        req: { headers: { authorization: `Bearer ${userTokens.student}` } },
      });
    }).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
