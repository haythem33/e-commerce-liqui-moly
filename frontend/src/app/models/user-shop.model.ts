import { car_parts } from './cars-parts.model';

export interface user_shop {
  _id?: string;
  displayName: string;
  email: string;
  password: string;
  phoneNumber: number;
  photoURL: string;
  provider: string;
  emailVerified: boolean;
  address: {
    string: string;
    city: string;
    state: string;
  };
  cart: [{ car_part: car_parts; quantity: number }];
  whistList: car_parts[];
}
