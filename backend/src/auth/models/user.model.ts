import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CarParts } from 'src/shop/models/car-parts.model';
export type UserDocument = user & Document;

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
}
export const UserSchema = SchemaFactory.createForClass(user);
