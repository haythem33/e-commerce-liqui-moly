import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from 'src/core/services/file.service';
import { CarCategory } from './models/car-category.model';
import { CarParts } from './models/car-parts.model';
import { car } from './models/car.model';
import { ShopService } from './services/shop.service';

@Controller({
  path: 'shop',
  version: '1',
})
export class ShopController {
  constructor(
    private shopService: ShopService,
    private fileService: FileService,
  ) {}

  @Get('filter_car')
  @HttpCode(HttpStatus.OK)
  filter_car(@Query('car_filter') filter: string): Promise<car[]> {
    return this.shopService.find_cars_by_string(filter);
  }
  @Get('get_categorys/:full')
  @HttpCode(HttpStatus.OK)
  getCategorys(@Param('full') full: boolean): Promise<CarCategory[]> {
    return this.shopService.getCategory(full);
  }
  @Get('get_products')
  @HttpCode(HttpStatus.OK)
  async getProductsByPopularity(): Promise<CarParts[]> {
    return this.shopService.getProducts();
  }
}
