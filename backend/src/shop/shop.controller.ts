import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CarCategory } from './models/car-category.model';
import { CarParts } from './models/car-parts.model';
import { car } from './models/car.model';
import { FilterPipe } from './pipes/filter.pipe';
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
  @Get('get_products_by_car')
  @HttpCode(HttpStatus.OK)
  async getProductsByCar(
    @Query('make') make: string,
    @Query('model') model: string,
    @Query('year') year: number,
  ): Promise<CarParts[]> {
    return this.shopService.getProductsByCar(make, model, year);
  }
  @Get('get_products_by_category')
  @HttpCode(HttpStatus.OK)
  async getProductsByCategory(@Param('id') id: string): Promise<CarParts[]> {
    return this.shopService.getProductByCategory(id);
  }
  @Get('get_products_by_subCategory')
  @HttpCode(HttpStatus.OK)
  async getProductsBySubCategory(subCategory: string): Promise<CarParts[]> {
    return this.shopService.getProductsBySubCategory(subCategory);
  }
  @Get('get_cars_make')
  @HttpCode(HttpStatus.OK)
  async getCarsMake(): Promise<string[]> {
    return this.shopService.getCarsMake();
  }
  @Get('get_car_model/:make')
  @HttpCode(HttpStatus.OK)
  async getCarsModel(@Param('make') make: string): Promise<string[]> {
    return this.shopService.getCarsModel(make);
  }
  @Get('get_car_year/:make/:model')
  @HttpCode(HttpStatus.OK)
  async getCarsYear(
    @Param('make') make: string,
    @Param('model') model: string,
  ): Promise<number[]> {
    return this.shopService.getCarsYear(make, model);
  }
  @Get('fullFilter')
  @UsePipes(FilterPipe)
  @HttpCode(HttpStatus.OK)
  async fullFilter(
    @Query('category') category: CarCategory[],
    @Query('subCategory') subCategory: string[],
    @Query('car') cars: car[],
    @Query('brand') brands: string[],
    @Query('price') price: { min: number; max: number },
  ): Promise<CarParts[]> {
    return this.shopService.fullFilter(
      category,
      subCategory,
      cars,
      brands,
      price,
    );
  }
  @Post('add-user-cars/:user_id')
  @HttpCode(HttpStatus.OK)
  async addUserCars(
    @Param('user_id') user_id: string,
    @Body() user_car: car,
  ): Promise<string> {
    return this.shopService.addUserCar(user_id, user_car);
  }
  @Post('remove-user-cars/:user_id')
  @HttpCode(HttpStatus.OK)
  async removeUserCars(
    @Param('user_id') user_id: string,
    @Body() user_car: car,
  ): Promise<string> {
    return this.shopService.removeUserCar(user_id, user_car);
  }
}
