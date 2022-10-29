import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ShopModule } from './shop/shop.module';
import { AdminModule } from './admin/admin.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/liqui_moly'),
    ConfigModule.forRoot({ isGlobal: true }),
    ShopModule,
    AdminModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
