import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user, UserDocument } from 'src/auth/models/user.model';
import { CarParts, CarPartsDocument } from 'src/shop/models/car-parts.model';
import { orderState, paymentMethod } from 'src/auth/models/user.model';
@Injectable()
export class CartService {
  constructor(
    @InjectModel(CarParts.name) private carPartModel: Model<CarPartsDocument>,
    @InjectModel(user.name) private userModel: Model<UserDocument>,
  ) {}
  async addProduct(
    id: string,
    product: {
      car_part_id: string;
      quantity: number;
    },
  ): Promise<string> {
    const findProduct = await this.carPartModel.findById(product.car_part_id);
    if (findProduct.quantity < product.quantity) {
      throw new HttpException('NO QUANTITY LEFT', HttpStatus.FORBIDDEN);
    }
    const checkProductInCart = await this.userModel.countDocuments({
      _id: id,
      'cart.car_part': product.car_part_id,
    });
    if (checkProductInCart > 0) {
      await this.userModel.updateOne(
        { _id: id, 'cart.car_part': product.car_part_id },
        { $set: { 'cart.$.quantity': product.quantity } },
      );
      return 'ADDED';
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        $push: { cart: { car_part: findProduct, quantity: product.quantity } },
      },
    );
    return 'ADDED';
  }
  async removeProduct(id: string, product_id: string): Promise<string> {
    const findProduct = await this.carPartModel.findById(product_id);
    await this.userModel.updateOne(
      { _id: id },
      {
        $pull: { cart: { car_part: findProduct._id } },
      },
    );
    return 'REMOVED';
  }
  async getUserCart(
    user_id: string,
  ): Promise<{ car_part: CarParts; quantity: number }[]> {
    const user = await this.userModel
      .findById(user_id)
      .populate({ path: 'cart.car_part', model: CarParts.name });
    return user.cart;
  }
  async add_order(
    id_user: string,
    invoice: Express.Multer.File,
    body: {
      orderPayment: paymentMethod;
      totalPriceTTC: number;
      totalPriceHT: number;
      adress?: Record<string, string>;
    },
  ): Promise<string> {
    const user = await this.userModel.findById(id_user);
    if (!user) {
      throw new HttpException('Invalid user', HttpStatus.FORBIDDEN);
    }
    const order = {
      orderStatus: orderState.waiting_delivery,
      orderInvoiceUrl: invoice.filename,
      orderPayment: body.orderPayment,
      order: user.cart,
      totalPriceTTC: body.totalPriceTTC,
      totalPriceHT: body.totalPriceHT,
      adress: body.adress === undefined ? body.adress : user.adresse,
      order_date: new Date(),
    };
    await Promise.all(
      user.cart.map((value) =>
        this.carPartModel.updateOne(
          { _id: value.car_part },
          { $inc: { quantity: -value.quantity } },
        ),
      ),
    );
    await this.userModel.updateOne(
      { _id: id_user },
      {
        $push: { orders: order },
        $set: { cart: [] },
      },
    );
    return 'ORDER ADDED';
  }
}
