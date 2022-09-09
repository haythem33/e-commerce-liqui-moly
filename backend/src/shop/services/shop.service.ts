import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { car, CarDocument } from '../models/car.model';

@Injectable()
export class ShopService implements OnApplicationBootstrap {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @InjectModel(car.name) private carModel: Model<CarDocument>,
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
}
