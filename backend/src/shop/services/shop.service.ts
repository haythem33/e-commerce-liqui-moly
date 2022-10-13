import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService } from 'src/core/services/file.service';
import { CarCategory, CarCategoryDocument } from '../models/car-category.model';
import { CarParts, CarPartsDocument } from '../models/car-parts.model';
import { car, CarDocument } from '../models/car.model';

@Injectable()
export class ShopService implements OnApplicationBootstrap {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(car.name) private readonly carModel: Model<CarDocument>,
    @InjectModel(CarCategory.name)
    private readonly carCategoryModel: Model<CarCategoryDocument>,
    @InjectModel(CarParts.name)
    private readonly carPartsModel: Model<CarPartsDocument>,
    private readonly fileService: FileService,
  ) {}
  onApplicationBootstrap() {
    this.insert_list_cars();
  }

  insert_list_cars(): void {
    this.httpService
      .get(
        'https://parseapi.back4app.com/classes/Carmodels_Car_Model_List?limit=max',
        {
          headers: {
            'X-Parse-Application-Id': this.configService.get<string>(
              'BACK4APP_APPLICATION_KEY',
            ),
            'X-Parse-REST-API-Key': this.configService.get<string>(
              'BACK4APP_REST_API_Key',
            ),
          },
        },
      )
      .subscribe({
        next: async (res) =>
          this.carModel
            .insertMany(res.data.results, { ordered: false })
            .catch(() => null),
        error: (err) => console.error(err),
      });
  }
  async find_cars_by_string(filter: string): Promise<car[]> {
    const car_found: car[] = await this.carModel
      .aggregate([
        { $addFields: { full_filter: { $concat: ['$Make', ' ', '$Model'] } } },
        {
          $match: {
            full_filter: { $regex: new RegExp(filter), $options: 'ig' },
          },
        },
      ])
      .limit(10);
    return car_found;
  }
  async getCategory(): Promise<CarCategory[]> {
    return this.carCategoryModel.find();
  }
  async getProducts(): Promise<CarParts[]> {
    return this.carPartsModel
      .find()
      .populate({
        path: 'category',
        model: CarCategory.name,
        select: '-_id -cars_part -__v',
      })
      .populate({
        path: 'cars',
        model: car.name,
        select: '-_id -__v',
      });
  }
  async getProductById(id: string): Promise<CarParts> {
    return this.carPartsModel
      .findById(id)
      .populate({
        path: 'category',
        model: CarCategory.name,
        select: '-_id -cars_part -__v',
      })
      .populate({
        path: 'cars',
        model: car.name,
        select: '-_id -__v',
      });
  }
}
