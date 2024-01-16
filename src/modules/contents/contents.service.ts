import { Injectable } from '@nestjs/common';

import { ContentsRepository } from './contents.repository';
import { GetContentArgs } from './dtos/args/get-content.args';
import { GetContentsArgs } from './dtos/args/get-contents.args';
import { Content } from './entities/content';

@Injectable()
export class ContentsService {
  constructor(private repository: ContentsRepository) {}

  public async getContent(getToiletArgs: GetContentArgs): Promise<Content> {
    return this.repository.getContent({
      where: { id: getToiletArgs.id },
    });
  }
  public async getContents(
    getContentsArgs: GetContentsArgs,
  ): Promise<Content[]> {
    return this.repository.getContents({
      where: {
        OR: [
          { id: { in: getContentsArgs.ids } },
          {
            name: {
              contains: getContentsArgs.name,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: getContentsArgs.description,
              mode: 'insensitive',
            },
          },
          {
            content_type_id: {
              in: getContentsArgs.content_type_ids,
            },
          },
        ],
      },
    });
  }
}
