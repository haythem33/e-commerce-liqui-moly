import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CarParts } from 'src/shop/models/car-parts.model';
import { car } from 'src/shop/models/car.model';
import { user, UserDocument } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel(user.name) private userModel: Model<UserDocument>) {}

  async addUser(user: user): Promise<{ message: string; user: user }> {
    const findUser = await this.userModel.findOne({ email: user.email });
    if (findUser) {
      throw new HttpException('USER ALEARDY EXIST', HttpStatus.FOUND);
    }
    await this.userModel.create(user);
    return { message: 'USER ADDED SUCCESSFULY', user: user };
  }
  async login(user: user): Promise<{ message: string; user: user }> {
    if (user.provider === 'INTERNAL') {
      const findUser = await this.userModel.findOne({
        email: user.email,
      });
      if (!findUser) {
        throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      }
      return { message: 'SUCCESS', user: findUser };
    }
    if (user.phoneNumber === null) {
      throw new HttpException('MISSING INFORMATION', HttpStatus.NOT_ACCEPTABLE);
    }
    return this.addUser(user);
  }
  async register(user: user): Promise<{ message: string; user: user }> {
    if (user.phoneNumber === null) {
      throw new HttpException('MISSING INFORMATION', HttpStatus.NOT_ACCEPTABLE);
    }
    return this.addUser(user);
  }
  async get_user(email: string): Promise<{ message: string; user: user }> {
    const findUser = await this.userModel
      .findOne({ email })
      .populate({ path: 'cart.car_part', model: CarParts.name })
      .populate({
        path: 'cars',
        model: car.name,
      })
      .select('-orders');
    if (!findUser) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return { message: 'SUCCESS', user: findUser };
  }
}
