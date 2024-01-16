import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { Content } from './entities/content';

@Injectable()
export class ContentsRepository {
  constructor(private prisma: PrismaService) {}

  async getContent(params: {
    where?: Prisma.contentsWhereUniqueInput;
  }): Promise<Content> {
    const { where } = params;

    return this.prisma.contents.findUnique({ where });
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
    });
  }
}
