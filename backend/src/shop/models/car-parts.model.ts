import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { car } from './car.model';
import * as mongoose from 'mongoose';
import { CarCategory } from './car-category.model';
import { ReadStream } from 'fs';

export type CarPartsDocument = CarParts & Document;

@Schema()
export class CarParts {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  quantity: number;
  @Prop({ required: true })
  price: string;
  @Prop({ required: true })
  image_urls: string[];
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carcategories',
  })
  category: CarCategory;
  @Prop({ required: false })
  sub_category: string[];
  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cars' }],
    default: [],
  })
  cars: car[];
}
export const CarPartsSchema = SchemaFactory.createForClass(CarParts);
