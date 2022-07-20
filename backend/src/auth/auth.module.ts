import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { user, UserSchema } from './models/user.model';
import { AuthService } from './services/auth.service';
import { AuthValidationMiddleware } from './middleware/auth-validation.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthValidationMiddleware).forRoutes(AuthController);
  }
}
