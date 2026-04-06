import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from '@/domain/enums/role.enum';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload & { sub: string; email: string; role: Role };
}

/**
 * Returns the requesting user's ID, or undefined if the user is an admin.
 * Use cases treat undefined as "no ownership restriction".
 */
export function getRequesterId(
  request: AuthenticatedRequest,
): string | undefined {
  return request.user.role === Role.ADMIN ? undefined : request.user.sub;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token was provided.');
    }

    try {
      request.user = await this.jwtService.verifyAsync<
        JwtPayload & { sub: string; email: string; role: Role }
      >(token);
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
