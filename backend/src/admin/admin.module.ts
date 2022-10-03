import { Module } from '@nestjs/common';
import { AdminServiceService } from './services/admin-service.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { car, CarSchema } from 'src/shop/models/car.model';
import { CarParts, CarPartsSchema } from 'src/shop/models/car-parts.model';
import {
  CarCategory,
  CarCategorySchema,
} from 'src/shop/models/car-category.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: car.name, schema: CarSchema },
      { name: CarParts.name, schema: CarPartsSchema },
      { name: CarCategory.name, schema: CarCategorySchema },
    ]),
  ],
  providers: [AdminServiceService],
  controllers: [AdminController],
})
export class AdminModule {}
