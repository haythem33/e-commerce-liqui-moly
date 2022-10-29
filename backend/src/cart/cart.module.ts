import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { user, UserSchema } from 'src/auth/models/user.model';
import { CarParts, CarPartsSchema } from 'src/shop/models/car-parts.model';
import { CartController } from './cart.controller';
import { CartService } from './services/cart.service';

@Module({
  controllers: [CartController],
  imports: [
    MongooseModule.forFeature([
      { name: CarParts.name, schema: CarPartsSchema },
      { name: user.name, schema: UserSchema },
    ]),
  ],
  providers: [CartService],
})
export class CartModule {}
