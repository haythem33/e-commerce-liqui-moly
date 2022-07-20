import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { user } from './models/user.model';
import { AuthService } from './services/auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login/native')
  @HttpCode(HttpStatus.ACCEPTED)
  native_login(@Body() body: user): Promise<any> {
    return;
  }

  @Post('login/external')
  @HttpCode(HttpStatus.ACCEPTED)
  external_login(@Body() body: user): Promise<any> {
    return;
  }

  @Post('register/native')
  @HttpCode(HttpStatus.CREATED)
  native_register(@Body() user: user): Promise<string> {
    return this.authService.addUser(user);
  }

  @Post('register/external')
  @HttpCode(HttpStatus.CREATED)
  async external_register(@Body() user: user): Promise<any> {
    return this.authService.addUser(user);
  }
}
