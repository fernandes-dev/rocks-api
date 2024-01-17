import { Injectable } from '@nestjs/common';

import { ContentsRepository } from './contents.repository';
import { GetContentsArgs } from './dtos/args/get-contents.args';
import { Content } from './entities/content';
import { CreateContentInput } from './dtos/inputs/create-content.input';
import {
  ContentType,
  IValidContentTypes,
  VALID_CONTENT_TYPES,
} from './entities/content-type';
import { ServiceError } from '../../shared/errors/service-error';
import { calculateSkipDatabase } from '../../shared/helpers/calculate-skiup-database';
import { CreateContentViewInput } from './dtos/inputs/create-content-view.input';
import { GetContentViewArgs } from './dtos/args/get-content-view.args';
import { UpdateContentInput } from './dtos/inputs/update-content.input';

@Injectable()
export class ContentsService {
  constructor(private repository: ContentsRepository) {}

  public async getContent(id: string): Promise<Content> {
    return this.repository.getContent(id);
  }

  public async getContentTypes(): Promise<ContentType[]> {
    return this.repository.getContentTypes();
  }

  public async getContentType(id: number): Promise<ContentType> {
    return this.repository.getContentType(id);
  }

  public async getContents(
    getContentsArgs: GetContentsArgs,
  ): Promise<Content[]> {
    const DEFAULT_PER_PAGE = 20;

    const skip = calculateSkipDatabase(
      getContentsArgs.page ?? 1,
      getContentsArgs.per_page ?? DEFAULT_PER_PAGE,
    );

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
      take: getContentsArgs.per_page ?? DEFAULT_PER_PAGE,
      skip,
    });
  }

  public async createContent(
    createContentInput: CreateContentInput,
  ): Promise<Content> {
    return this.repository.createContent(createContentInput);
  }

  public async updateContent({
    id,
    content_type_id,
    description,
    name,
  }: UpdateContentInput): Promise<Content> {
    const data = {
      id,
      content_type_id,
      description,
      name,
    };

    Object.entries(data).forEach(([key, value]) => {
      if (!value) Reflect.deleteProperty(data, key);
    });

    return this.repository.updateContent(data);
  }

  public async deleteContent(id: string): Promise<void> {
    await this.repository.deleteContent(id);
  }

  public async createContentType(
    title: IValidContentTypes,
  ): Promise<ContentType> {
    if (!VALID_CONTENT_TYPES.includes(title))
      throw new ServiceError('invalid content type');

    return this.repository.createContentType(title);
  }

  public async createContentView(
    createContentViewInput: CreateContentViewInput,
  ) {
    return this.repository.createContentView(createContentViewInput);
  }

  public async getContentView(getContentViewArgs: GetContentViewArgs) {
    return this.repository.getContentView(getContentViewArgs);
  }
}
