import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const isProduction = process.env.DATABASE_URL !== undefined;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: isProduction ? 'https://url-shorten-fe-0dc5cd6d3c7b.herokuapp.com' : 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT || 5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
