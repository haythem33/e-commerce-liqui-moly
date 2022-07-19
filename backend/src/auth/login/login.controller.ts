import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { UserExistPipe } from '../pipes/user-exist.pipe';

@Controller('login')
export class LoginController {
  @Post('native')
  @UsePipes(UserExistPipe)
  @HttpCode(201)
  async native_login(@Body() body): Promise<any> {
    return body.username;
  }
  @Post('external')
  @HttpCode(201)
  async external_login(@Body() body): Promise<any> {
    return body.username;
  }
}
