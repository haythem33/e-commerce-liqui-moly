import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { car, CarSchema } from './models/car.model';
import { InitServiceService } from './services/init-service.service';
import { ShopController } from './shop.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: car.name, schema: CarSchema }]),
  ],
  providers: [InitServiceService],
  controllers: [ShopController],
})
export class ShopModule {}
