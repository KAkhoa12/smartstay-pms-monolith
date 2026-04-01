import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionResponseFilter } from './common/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionResponseFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('API documentation for auth-service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(process.env.SWAGGER_PATH ?? 'api-docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 8081);
}
bootstrap();
