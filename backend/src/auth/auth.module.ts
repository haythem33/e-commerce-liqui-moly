import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { RegisterController } from './register/register.controller';

@Module({
  controllers: [LoginController, RegisterController],
})
export class AuthModule {}
