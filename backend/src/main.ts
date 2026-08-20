import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppLogger } from '@/infrastructure/monitoring/logger.service';
import { HttpMetricsInterceptor } from '@/infrastructure/monitoring/http-metrics.interceptor';
import { AllExceptionsFilter } from '@/infrastructure/monitoring/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(AppLogger));
  app.useGlobalFilters(app.get(AllExceptionsFilter));
  app.useGlobalInterceptors(app.get(HttpMetricsInterceptor));

  if (process.env.SWAGGER_ENABLED === 'true') {
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
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  app.get(AppLogger).log(`Server listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
