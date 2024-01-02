import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/utils/token.payload';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.userService.getUserById(user.sub);
  }
  @Get(':userId')
  getOneUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
  }
}
