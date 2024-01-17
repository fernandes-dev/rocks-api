import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { Content } from './entities/content';
import { CreateContentInput } from './dtos/inputs/create-content.input';
import { ContentType, IValidContentTypes } from './entities/content-type';
import { CreateContentViewInput } from './dtos/inputs/create-content-view.input';
import { GetContentViewArgs } from './dtos/args/get-content-view.args';
import { ContentView } from './entities/content-view';
import { UpdateContentInput } from './dtos/inputs/update-content.input';

@Injectable()
export class ContentsRepository {
  constructor(private prisma: PrismaService) {}

  async getContent(id: string): Promise<Content> {
    return this.prisma.contents.findUnique({
      where: { id },
      include: {
        _count: { select: { content_views: { where: { content_id: id } } } },
        content_types: true,
        content_views: {
          include: {
            users: true,
            contents: true,
          },
        },
      },
    });
  }

  async getContentTypes(): Promise<ContentType[]> {
    return this.prisma.content_types.findMany();
  }

  async getContentType(id: number): Promise<ContentType> {
    return this.prisma.content_types.findUnique({ where: { id } });
  }

  async getContents(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.contentsWhereUniqueInput;
    where?: Prisma.contentsWhereInput;
    orderBy?: Prisma.contentsOrderByWithRelationInput;
  }): Promise<Content[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.contents.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        _count: { select: { content_views: true } },
        content_types: true,
        content_views: {
          include: {
            users: true,
            contents: true,
          },
        },
      },
    });
  }

  async createContent({
    content_type_id,
    description,
    name,
  }: CreateContentInput): Promise<Content> {
    return this.prisma.contents.create({
      data: {
        name,
        description,
        content_type_id,
      },
      include: {
        _count: { select: { content_views: true } },
        content_types: true,
        content_views: {
          include: {
            users: true,
            contents: true,
          },
        },
      },
    });
  }

  async updateContent(data: UpdateContentInput): Promise<Content> {
    return this.prisma.contents.update({
      data: data,
      where: { id: data.id },
      include: {
        _count: { select: { content_views: true } },
        content_types: true,
        content_views: {
          include: {
            users: true,
            contents: true,
          },
        },
      },
    });
  }

  async deleteContent(id: string): Promise<void> {
    await this.prisma.contents.delete({ where: { id } });
  }

  async createContentType(title: IValidContentTypes): Promise<ContentType> {
    return this.prisma.content_types.upsert({
      create: {
        title,
      },
      update: {},
      where: { title },
      include: {
        contents: true,
      },
    });
  }

  async createContentView({ content_id, user_id }: CreateContentViewInput) {
    return this.prisma.content_views.create({
      data: {
        content_id,
        user_id,
      },
      include: {
        contents: true,
        users: true,
      },
    });
  }

  async getContentView({
    content_id,
    user_id,
  }: GetContentViewArgs): Promise<ContentView[]> {
    return this.prisma.content_views.findMany({
      where: {
        user_id,
        content_id,
      },
      include: {
        contents: true,
        users: true,
      },
    });
  }

  async deleteContentView() {}
}
