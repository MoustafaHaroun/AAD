import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swagger = new DocumentBuilder()
    .setTitle('Trade2')
    .setDescription('API Documentation for Trade2')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swagger);

  SwaggerModule.setup('documentation', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
