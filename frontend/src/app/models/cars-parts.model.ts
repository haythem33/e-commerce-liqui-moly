import { cars_category } from './cars-category.model';
import { cars } from './cars.model';

export interface car_parts {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  image_urls: File[] | string[];
  category: cars_category;
  cars?: cars[];
}
