import { cars } from './cars.model';

export interface car_parts {
  name: string;
  quantity: number;
  price: number;
  image_urls: File[];
  category: string;
  cars?: cars[];
}
