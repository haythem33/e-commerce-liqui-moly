import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { user } from './models/user.model';
import { FirebaseUserPipe } from './pipes/firebase-user.pipe';
import { AuthService } from './services/auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(FirebaseUserPipe)
  @HttpCode(HttpStatus.ACCEPTED)
  login(@Body() body: user): Promise<{ message: string; user: user }> {
    return this.authService.login(body);
  }

  @Post('register')
  @UsePipes(FirebaseUserPipe)
  @HttpCode(HttpStatus.CREATED)
  native_register(
    @Body() body: user,
  ): Promise<{ message: string; user: user }> {
    return this.authService.register(body);
  }
  @Get('currentUser/:email')
  @HttpCode(HttpStatus.OK)
  get_user(
    @Param('email') email: string,
  ): Promise<{ message: string; user: user }> {
    return this.authService.get_user(email);
  }
}
