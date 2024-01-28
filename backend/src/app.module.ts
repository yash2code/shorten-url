import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from 'nestjs-transaction';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';
import { ShortUrl } from './short-url.entity';
import { Analytics } from './analytics.entity';

@Module({
  imports: [
    TransactionModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydb',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([ShortUrl, Analytics])
  ],
  controllers: [ShortUrlController],
  providers: [ShortUrlService]
})
export class AppModule { }
