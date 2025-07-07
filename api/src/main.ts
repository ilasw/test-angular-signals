import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { isProduction } from './shared/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      isProduction ? 'https://frontend-domain.com' : 'http://localhost:4200',
    ],
  });
  await app.listen(3030);
}

bootstrap();
