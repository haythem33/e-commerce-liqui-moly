import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CarParts } from 'src/shop/models/car-parts.model';

@Injectable()
export class CarPartsPipe implements PipeTransform {
  transform(car_part: CarParts, metadata: ArgumentMetadata) {
    car_part.category = JSON.parse(car_part.category as unknown as string);
    car_part.features = car_part.features.map((feature) =>
      JSON.parse(feature as unknown as string),
    );
    car_part.cars = car_part.cars.map((cars) =>
      JSON.parse(cars as unknown as string),
    );
    return car_part;
  }
}
