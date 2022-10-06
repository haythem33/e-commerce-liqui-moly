import { car_parts } from './cars-parts.model';

export interface cars_category {
  name: string;
  image_url: File;
  cars_parts?: car_parts[];
}
