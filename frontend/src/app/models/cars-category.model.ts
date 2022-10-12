import { car_parts } from './cars-parts.model';

export interface cars_category {
  name: string;
  image_url: File;
  sub_category?: string[];
  cars_parts?: car_parts[];
}
