import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { car_parts } from './cars-parts.model';

export interface cars_category {
  name: string;
  image_url: File | Observable<SafeUrl> | string;
  sub_category?: string[];
  cars_parts?: car_parts[];
}
