import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, LogInDto } from './dto/auth.dto';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/utils/token.payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerice: AuthService) {}
  @Post('signup')
  signUp(@Body() dto: SignInDto) {
    return this.authSerice.signUp(dto.name, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LogInDto) {
    return this.authSerice.logIn(dto.email, dto.password);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.authSerice.jwtRefresh(user.sub, user.exp);
  }
}
