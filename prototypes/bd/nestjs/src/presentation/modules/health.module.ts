import { Module } from '@nestjs/common';
import { HealthController } from '@/presentation/controllers';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
