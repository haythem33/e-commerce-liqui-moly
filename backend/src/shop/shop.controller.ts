import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { CarCategory } from './models/car-category.model';
import { CarParts } from './models/car-parts.model';
import { car } from './models/car.model';
import { ShopService } from './services/shop.service';

@Controller({
  path: 'shop',
  version: '1',
})
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get('/getProductBy_id/:id')
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('id') id: string): Promise<CarParts> {
    return this.shopService.getProductById(id);
  }
  @Get('filter_car')
  @HttpCode(HttpStatus.OK)
  filter_car(@Query('car_filter') filter: string): Promise<car[]> {
    return this.shopService.find_cars_by_string(filter);
  }
  @Get('get_categorys')
  @HttpCode(HttpStatus.OK)
  getCategorys(): Promise<CarCategory[]> {
    return this.shopService.getCategory();
  }
  @Get('get_products')
  @HttpCode(HttpStatus.OK)
  async getProductsByPopularity(): Promise<CarParts[]> {
    return this.shopService.getProducts();
  }
}
