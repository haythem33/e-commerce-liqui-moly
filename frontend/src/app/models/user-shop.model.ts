import { car_parts } from './cars-parts.model';
import { cars } from './cars.model';
export enum orderState {
  waiting_delivery = 'EN ATTENTE DE LIVRAISON',
  Out_for_delivery = 'EN COURS DE LIVRAISON',
  FINISHED = 'LIVRAISON TERMINER',
}
export enum paymentMethod {
  bankTransfer = 'VIREMENT BANCAIRE',
  PayWithDeleviry = 'PAYMENT A LA LIVRAISON',
}
export interface order {
  orderStatus: orderState;
  orderInvoiceUrl: string;
  orderPayment: paymentMethod;
  order_date?: Date;
  adress?: { state: string; city: string; street: string };
  order: Array<{ car_part: car_parts; quantity: number }>;
}
export interface user_shop {
  _id?: string;
  displayName: string;
  email: string;
  password: string;
  phoneNumber: number;
  photoURL: string;
  provider: string;
  emailVerified: boolean;
  adresse: {
    street: string;
    city: string;
    state: string;
  };
  cart: [{ car_part: car_parts; quantity: number }];
  whistList: car_parts[];
  orders: order[];
  cars: cars[];
}
