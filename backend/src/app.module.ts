import 'dotenv';
import { Module } from '@nestjs/common';
import DatabaseModule from '@/infrastructure/persistence/typeorm';
import {
  AuthModule,
  FavoriteModule,
  HealthModule,
  ListingModule,
  MessageModule,
  NotificationModule,
  UserModule,
} from '@/presentation/modules';
import { MetricsModule } from '@/infrastructure/monitoring/metrics.module';

const FEATURE_MODULES = [
  AuthModule,
  FavoriteModule,
  HealthModule,
  ListingModule,
  MessageModule,
  NotificationModule,
  UserModule,
];

@Module({
  imports: [DatabaseModule, MetricsModule, ...FEATURE_MODULES],
})
export class AppModule {}
