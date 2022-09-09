import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { car } from './car.model';
import * as mongoose from 'mongoose';

export type CarPartsDocument = CarParts & Document;

@Schema()
export class CarParts {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  referance: string;
  @Prop({ required: true })
  price: string;
  @Prop({ required: true })
  image_urls: string[];
  @Prop({ required: true })
  category: string;
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cars' }],
  })
  cars: car[];
}
export const CarPartsSchema = SchemaFactory.createForClass(CarParts);
