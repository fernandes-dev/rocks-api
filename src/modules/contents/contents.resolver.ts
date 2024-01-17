import { Args, Resolver, Query, Context, Mutation } from '@nestjs/graphql';
import { Content } from './entities/content';
import { GetContentArgs } from './dtos/args/get-content.args';
import { ContentsService } from './contents.service';
import { GetContentsArgs } from './dtos/args/get-contents.args';
import {
  IReqContext,
  ensureUserAuthenticated,
} from '../../shared/middlewares/auth.middleware';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateContentInput } from './dtos/inputs/create-content.input';
import {
  ContentType,
  IValidContentTypes,
  VALID_CONTENT_TYPES,
} from './entities/content-type';
import { CreateContentTypeInput } from './dtos/inputs/create-content-type.input';
import { GetContentsOutput } from './dtos/outputs/get-contents.output';
import { isUUID } from 'class-validator';
import { UpdateContentInput } from './dtos/inputs/update-content.input';

@Resolver(() => Content)
export class ContentsResolver {
  constructor(private readonly contentsService: ContentsService) {}

  @Query(() => Content, { name: 'content', nullable: false })
  async getContent(
    @Args() getContentArgs: GetContentArgs,
    @Context() context: IReqContext,
  ): Promise<Content> {
    const user = await ensureUserAuthenticated(context, ['admin', 'student']);

    if (!getContentArgs.id) throw new BadRequestException('id is required');

    if (!isUUID(getContentArgs.id))
      throw new BadRequestException('invalid content id');

    const foundContent = await this.contentsService.getContent(
      getContentArgs.id,
    );

    if (!foundContent) throw new NotFoundException('content not found');

    const foundContentView = await this.contentsService.getContentView({
      user_id: user.id,
      content_id: getContentArgs.id,
    });

    if (foundContentView.length === 0) {
      await this.contentsService.createContentView({
        user_id: user.id,
        content_id: getContentArgs.id,
      });
    }

    return this.contentsService.getContent(getContentArgs.id);
  }

  @Query(() => GetContentsOutput, { name: 'contents', nullable: false })
  async getContents(
    @Args() getContentsArgs: GetContentsArgs,
    @Context() context: IReqContext,
  ): Promise<{ list: Content[]; page: number; per_page: number }> {
    await ensureUserAuthenticated(context, ['admin', 'student']);

    const result = await this.contentsService.getContents(getContentsArgs);

    if (result.length === 0) throw new NotFoundException('contents not found');

    return {
      list: result,
      page: getContentsArgs.page,
      per_page: getContentsArgs.per_page,
    };
  }

  @Query(() => [ContentType], { name: 'contentTypes', nullable: false })
  async getContentTypes(
    @Context() context: IReqContext,
  ): Promise<ContentType[]> {
    await ensureUserAuthenticated(context, ['admin', 'student']);

    const result = await this.contentsService.getContentTypes();

    if (!result) throw new NotFoundException('content types not found');

    return result;
  }

  @Mutation(() => ContentType)
  async createContentType(
    @Args('createContentTypeData')
    createContentTypeData: CreateContentTypeInput,
    @Context() context: IReqContext,
  ): Promise<ContentType> {
    await ensureUserAuthenticated(context, ['admin']);

    if (
      !VALID_CONTENT_TYPES.includes(
        createContentTypeData.title as IValidContentTypes,
      )
    )
      throw new BadRequestException('invalid content type');

    return this.contentsService.createContentType(
      createContentTypeData.title as IValidContentTypes,
    );
  }

  @Mutation(() => Content)
  async createContent(
    @Args('createContentData') createContentData: CreateContentInput,
    @Context() context: IReqContext,
  ): Promise<Content> {
    await ensureUserAuthenticated(context, ['admin']);

    const foundContentType = await this.contentsService.getContentType(
      createContentData.content_type_id,
    );

    if (!foundContentType)
      throw new BadRequestException('content type not found');

    return this.contentsService.createContent(createContentData);
  }

  @Mutation(() => Content)
  async updateContent(
    @Args('updateContentData') updateContentData: UpdateContentInput,
    @Context() context: IReqContext,
  ): Promise<Content> {
    await ensureUserAuthenticated(context, ['admin']);

    if (!isUUID(updateContentData.id))
      throw new BadRequestException('invalid content id');

    const foundContent = await this.contentsService.getContent(
      updateContentData.id,
    );

    if (!foundContent) throw new NotFoundException('content not found');

    if (updateContentData.content_type_id) {
      const foundContentType = await this.contentsService.getContentType(
        updateContentData.content_type_id,
      );

      if (!foundContentType)
        throw new BadRequestException('content type not found');
    }

    return this.contentsService.updateContent(updateContentData);
  }

  @Mutation(() => Content)
  async deleteContent(
    @Args('id') id: string,
    @Context() context: IReqContext,
  ): Promise<Content> {
    await ensureUserAuthenticated(context, ['admin']);

    if (!isUUID(id)) throw new BadRequestException('invalid content id');

    const foundContent = await this.contentsService.getContent(id);

    if (!foundContent) throw new NotFoundException('content not found');

    await this.contentsService.deleteContent(id);

    return foundContent;
  }
}
