import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CarCategory } from './models/car-category.model';
import { car } from './models/car.model';
import { ShopService } from './services/shop.service';

@Controller({
  path: 'shop',
  version: '1',
})
export class ShopController {
  constructor(private shopService: ShopService) {}

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
}
