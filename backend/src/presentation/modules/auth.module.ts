import 'dotenv';
import { Module } from '@nestjs/common';
import { AuthService } from '@/infrastructure/services';
import { UserModule } from '@/presentation/modules/user.module';
import { AuthController } from '@/presentation/controllers';
import { JwtModule } from '@nestjs/jwt';
import { SignInUseCase } from '@/application/usecases';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, SignInUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
