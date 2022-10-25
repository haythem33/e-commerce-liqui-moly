import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
  async getProductsByCar(
    Make: string,
    model: string,
    year: number,
  ): Promise<CarParts[]> {
    console.log(Make, model, year);
    const findedCar = await this.carModel.findOne({ Make, model, year });
    return this.carPartsModel.find({ cars: findedCar._id });
  }
  async getProductByCategory(id: string): Promise<CarParts[]> {
    return this.carPartsModel.find({ category: id });
  }
  async getProductsBySubCategory(subCategory: string): Promise<CarParts[]> {
    return this.carPartsModel.find({ sub_category: subCategory });
  }
  async getCarsMake(): Promise<string[]> {
    return this.carModel.find().distinct('Make');
  }
  async getCarsModel(Make: string): Promise<string[]> {
    return this.carModel.find({ Make }).distinct('Model');
  }
  async getCarsYear(Make: string, Model: string): Promise<number[]> {
    return this.carModel.find({ Make, Model }).distinct('Year');
  }
  async fullFilter(
    category: CarCategory[],
    subCategory: string[],
    cars: car[],
    brands: string[],
    price: { min: number; max: number },
  ): Promise<CarParts[]> {
    return this.carPartsModel
      .find(await this.queryByCarOrBrands(cars, brands))
      .find(this.queryByCategory(category))
      .find(this.queryBySubCategory(subCategory))
      .find(this.queryByPrice(price));
  }
  async queryByCarOrBrands(cars: car[], brands: string[]) {
    if (cars.length === 0 && brands.length === 0) {
      return {};
    }
    if (cars.length > 0) {
      return {
        cars: {
          $in: await this.carModel
            .find({
              Make: cars.map((car) => car.Make),
              Model: cars.map((car) => car.Model),
              Year: cars.map((car) => car.Year),
            })
            .distinct('_id'),
        },
      };
    }
    if (brands.length > 0) {
      return {
        cars: {
          $in: await this.carModel.find({ Make: brands }).distinct('_id'),
        },
      };
    }
  }
  queryByCategory(categorys: CarCategory[]) {
    if (categorys.length === 0) {
      return {};
    }
    return { category: categorys.map((category) => (category as any)._id) };
  }
  queryBySubCategory(subCategory: string[]) {
    if (subCategory.length === 0) {
      return {};
    }
    return { sub_category: { $in: subCategory } };
  }
  queryByPrice(price: { min: number; max: number }) {
    return {
      price: {
        $gte: price.min > 0 ? price.min : 1,
        $lte: price.max > 0 ? price.max : 100000,
      },
    };
  }
}
