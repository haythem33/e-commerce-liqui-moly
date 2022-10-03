import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CarParts } from 'src/shop/models/car-parts.model';
import { AdminServiceService } from './services/admin-service.service';

@Controller({
  path: 'admin',
  version: '1',
})
export class AdminController {
  constructor(private adminService: AdminServiceService) {}

  @UseInterceptors(
    FilesInterceptor('image_urls', 50, {
      dest: './uploads',
    }),
  )
  @Post('addCarParts')
  @HttpCode(HttpStatus.CREATED)
  add_cars_parts(
    @Body() cars_parts: CarParts,
    @UploadedFiles() image_urls: Array<Express.Multer.File>,
  ): Promise<string> {
    return this.adminService.add_car_parts(cars_parts, image_urls);
  }
  @UseInterceptors(
    FileInterceptor('image_url', {
      dest: './uploads',
    }),
  )
  @Post('addCarCategory')
  add_cars_category(
    @Body() car_category,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return this.adminService.add_car_category(car_category, image);
  }
}
