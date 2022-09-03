import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = car & Document;

@Schema({
  autoIndex: true,
})
export class car {
  @Prop({ required: true })
  Make: string;
  @Prop({ required: true })
  Model: string;
  @Prop({ required: true })
  Category: string;
  @Prop({ required: true })
  Year: number;
}

export const CarSchema = SchemaFactory.createForClass(car);

CarSchema.index({ Make: 1, Model: 1, Year: 1 }, { unique: true });
