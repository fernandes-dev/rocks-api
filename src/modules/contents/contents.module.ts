import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from '../../database/prisma.module';
import { ContentsResolver } from './contents.resolver';
import { ContentsRepository } from './contents.repository';
import { ContentsService } from './contents.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    PrismaModule,
  ],
  providers: [ContentsResolver, ContentsRepository, ContentsService],
  exports: [ContentsResolver, ContentsService],
})
export class ContentsModule {}
