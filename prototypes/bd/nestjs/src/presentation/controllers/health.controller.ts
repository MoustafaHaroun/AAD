import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import 'dotenv';

@Controller('health')
export class HealthController {
  @HttpCode(HttpStatus.OK)
  @Get()
  getUser(): Promise<string> {
    return Promise.resolve(`healthy (${process.env.NODE_ENV})`);
  }
}
