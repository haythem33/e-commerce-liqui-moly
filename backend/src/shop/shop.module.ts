import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { user, UserSchema } from 'src/auth/models/user.model';
import { CoreModule } from 'src/core/core.module';
import { CarCategory, CarCategorySchema } from './models/car-category.model';
import { CarParts, CarPartsSchema } from './models/car-parts.model';
import { car, CarSchema } from './models/car.model';
import { ShopService } from './services/shop.service';
import { ShopController } from './shop.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: car.name, schema: CarSchema },
      { name: CarParts.name, schema: CarPartsSchema },
      { name: CarCategory.name, schema: CarCategorySchema },
      { name: user.name, schema: UserSchema },
    ]),
    CoreModule,
  ],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
