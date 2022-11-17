import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CarParts } from 'src/shop/models/car-parts.model';
import { car } from 'src/shop/models/car.model';
export type UserDocument = user & Document;
export enum orderState {
  waiting_delivery = 'EN ATTENTE DE LIVRAISON',
  Out_for_delivery = 'EN COURS DE LIVRAISON',
}
export enum paymentMethod {
  bankTransfer = 'VIREMENT BANCAIRE',
  PayWithDeleviry = 'PAYMENT A LA LIVRAISON',
}
@Schema()
export class user {
  @Prop({ required: true })
  displayName: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: false })
  password: string;
  @Prop({ required: true })
  phoneNumber: number;
  @Prop({ required: true, default: null })
  photoURL: string;
  @Prop({ required: true })
  provider: string;
  @Prop({ required: true, default: false })
  emailVerified: boolean;
  @Prop(
    raw({
      street: { type: String },
      city: { type: String },
      state: { type: String },
    }),
  )
  adresse: Record<string, string>;
  @Prop({
    required: true,
    default: [],
    type: raw([
      {
        car_part: {
          type: mongoose.Schema.Types.ObjectId,
          ref: CarParts.name,
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ]),
    _id: false,
  })
  cart: Array<{ car_part: CarParts; quantity: number }>;
  @Prop({
    required: true,
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: CarParts.name }],
  })
  whistList: CarParts[];
  @Prop({
    required: true,
    default: [],
    type: raw([
      {
        orderStatus: { type: String },
        orderPayment: { type: String },
        orderInvoiceUrl: { type: String },
        totalPriceTTC: { type: Number },
        totalPriceHT: { type: Number },
        order_date: { type: Date },
        adress: {
          street: { type: String },
          city: { type: String },
          state: { type: String },
        },
        order: [
          {
            type: {
              car_part: {
                type: mongoose.Schema.Types.ObjectId,
                ref: CarParts.name,
                required: true,
              },
              quantity: { type: Number, required: true },
            },
          },
        ],
      },
    ]),
  })
  orders: Array<{
    orderStatus: orderState;
    orderInvoiceUrl: string;
    orderPayment: paymentMethod;
    adress: Record<string, string>;
    order: Array<{ car_part: CarParts; quantity: number }>;
  }>;
  @Prop({
    required: true,
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: car.name }],
  })
  cars: car[];
}
export const UserSchema = SchemaFactory.createForClass(user);
