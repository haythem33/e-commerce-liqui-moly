import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user, UserDocument } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel(user.name) private userModel: Model<UserDocument>) {}

  async addUser(user: user): Promise<string> {
    const findUser = await this.userModel.findOne({ email: user.email });
    if (findUser) {
      throw new HttpException('USER ALEARDY EXIST', HttpStatus.FOUND);
    }
    await this.userModel.create(user);
    return 'USER ADDED SUCCESSFULY';
  }
}
