import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ContentsModule } from './modules/contents/contents.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ContentsModule,
    PrismaModule,
  ],
  providers: [AppService],
})
export class AppModule {}
