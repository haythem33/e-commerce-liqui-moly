import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CarParts } from './car-parts.model';

export type CarCategoryDocument = CarCategory & Document;

@Schema()
export class CarCategory {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  image_url: string;
  @Prop({ required: false })
  sub_category?: string[];
  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'carparts' }],
  })
  cars_part: CarParts[];
}

export const CarCategorySchema = SchemaFactory.createForClass(CarCategory);
