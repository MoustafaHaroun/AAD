import 'dotenv';
import { Module } from '@nestjs/common';
import DatabaseModule from '@/infrastructure/persistence/typeorm';
import {
  AuthModule,
  HealthModule,
  ListingModule,
  UserModule,
} from '@/presentation/modules';

const FEATURE_MODULES = [AuthModule, HealthModule, ListingModule, UserModule];

@Module({
  imports: [DatabaseModule, ...FEATURE_MODULES],
})
export class AppModule {}
