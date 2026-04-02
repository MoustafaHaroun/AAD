import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppLogger } from '@/infrastructure/monitoring/logger.service';
import { HttpMetricsInterceptor } from '@/infrastructure/monitoring/http-metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(AppLogger));
  app.useGlobalInterceptors(app.get(HttpMetricsInterceptor));

  if (process.env.NODE_ENV !== 'production') {
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

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
