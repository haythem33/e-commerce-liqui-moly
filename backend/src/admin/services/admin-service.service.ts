import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CarCategory,
  CarCategoryDocument,
} from 'src/shop/models/car-category.model';
import { CarParts, CarPartsDocument } from 'src/shop/models/car-parts.model';

@Injectable()
export class AdminServiceService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(CarParts.name) private carPartModel: Model<CarPartsDocument>,
    @InjectModel(CarCategory.name)
    private carCategoryModel: Model<CarCategoryDocument>,
  ) {}

  onApplicationBootstrap() {
    console.log('INSERT ADMIN');
  }

  public async add_car_parts(
    car_parts: CarParts,
    images_url: Array<Express.Multer.File>,
  ): Promise<string> {
    const findCarPart = await this.carPartModel.findOne({
      name: car_parts.name,
    });
    if (findCarPart) {
      throw new HttpException('CART PARTS EXIST', HttpStatus.CONFLICT);
    }
    car_parts.image_urls = images_url.map((image) => image.filename);
    car_parts.cars = car_parts.cars.map((cars) =>
      JSON.parse(cars as unknown as string),
    );
    car_parts.category = JSON.parse(car_parts.category as unknown as string);
    const added_car_parts = await this.carPartModel.create(car_parts);
    await this.carCategoryModel.findOneAndUpdate(
      { name: car_parts.category.name },
      { $push: { cars_part: added_car_parts } },
    );
    return 'ADDED';
  }

  public async add_car_category(
    car_category: CarCategory,
    image: Express.Multer.File,
  ): Promise<string> {
    const findCarCategory = await this.carCategoryModel.findOne({
      name: car_category.name,
    });
    if (findCarCategory) {
      throw new HttpException('CART CATEGORY EXIST', HttpStatus.CONFLICT);
    }
    car_category.image_url = image.filename;
    await this.carCategoryModel.create(car_category);
    return 'ADDED';
  }
}
