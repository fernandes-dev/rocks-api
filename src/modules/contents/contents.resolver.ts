import { Args, Resolver, Query } from '@nestjs/graphql';
import { Content } from './entities/content';
import { GetContentArgs } from './dtos/args/get-content.args';
import { ContentsService } from './contents.service';
import { GetContentsArgs } from './dtos/args/get-contents.args';

@Resolver(() => Content)
export class ContentsResolver {
  constructor(private readonly contentsService: ContentsService) {}

  @Query(() => String)
  getHello(): string {
    return 'Hello World';
  }

  @Query(() => Content, { name: 'content', nullable: false })
  async getContent(@Args() getContentArgs: GetContentArgs): Promise<Content> {
    if (!getContentArgs.id) throw new Error('id is required');

    const result = await this.contentsService.getContent(getContentArgs);

    if (!result) throw new Error('result not found');

    return result;
  }

  @Query(() => [Content], { name: 'contents', nullable: false })
  async getContents(
    @Args() getContentsArgs: GetContentsArgs,
  ): Promise<Content[]> {
    const result = await this.contentsService.getContents(getContentsArgs);

    if (result.length === 0) throw new Error('results not found');

    return result;
  }
}
