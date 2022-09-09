import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CarParts } from 'src/shop/models/car-parts.model';
import { AdminServiceService } from './services/admin-service.service';

@Controller({
  path: 'admin',
  version: '1',
})
export class AdminController {
  constructor(private adminService: AdminServiceService) {}
  @Post('addCarParts')
  @HttpCode(HttpStatus.CREATED)
  add_cars_parts(@Body() cars_parts: CarParts) {
    console.log(cars_parts);
  }
}
