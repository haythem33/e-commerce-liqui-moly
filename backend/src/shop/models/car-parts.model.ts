import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { car } from './car.model';
import * as mongoose from 'mongoose';
import { CarCategory } from './car-category.model';

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
    ref: CarCategory.name,
  })
  category: CarCategory;
  @Prop({ required: false })
  sub_category: string[];
  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: car.name }],
    default: [],
  })
  cars: car[];
  @Prop({ required: true })
  description: string;
  @Prop(
    raw([
      {
        feature_name: { type: String },
        feature_value: { type: String },
      },
    ]),
  )
  features: Record<string, string>[];
  @Prop({ required: false })
  colors: string[];
  @Prop({ required: true })
  insertion_date: Date;
}
export const CarPartsSchema = SchemaFactory.createForClass(CarParts);
