import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
}
export const UserSchema = SchemaFactory.createForClass(user);
