import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);

    if (user == null || user.password != password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return await this.jwtService.signAsync(payload);
  }

}
