import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
  login(@Body() body: user): Promise<any> {
    return this.authService.login(body);
  }

  @Post('register')
  @UsePipes(FirebaseUserPipe)
  @HttpCode(HttpStatus.CREATED)
  native_register(@Body() user: user): Promise<string> {
    return this.authService.register(user);
  }
}
