import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from 'nestjs-transaction';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';
import { ShortUrl } from './short-url.entity';
import { Analytics } from './analytics.entity';
import { DataSourceOptions } from 'typeorm';

const isProduction = process.env.DATABASE_URL !== undefined;

const databaseConfig: DataSourceOptions = isProduction
  ? {
    type: 'postgres',
    url: process.env.DATABASE_URL, // Use Heroku's DATABASE_URL in production
    ssl: {
      rejectUnauthorized: false, // Required for Heroku's self-signed certificates
    },
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, // Should be false in production for safety
  }
  : {
    type: 'postgres',
    host: 'db', // Use Docker service name in development
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'mydb',
    synchronize: true, // Can be true in development
  };

@Module({
  imports: [
    TransactionModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([ShortUrl, Analytics])
  ],
  controllers: [ShortUrlController],
  providers: [ShortUrlService]
})
export class AppModule { }
