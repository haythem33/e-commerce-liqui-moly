import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { paymentMethod } from 'src/auth/models/user.model';
import { CartService } from '../services/cart.service';

@Controller({
  path: 'checkout',
  version: '1',
})
export class CheckoutController {
  constructor(private cartService: CartService) {}

  @UseInterceptors(FileInterceptor('invoice', { dest: './uploads' }))
  @Post('add-order/:id_user')
  @HttpCode(HttpStatus.OK)
  async add_order(
    @Param('id_user') id_user: string,
    @UploadedFile() invoice: Express.Multer.File,
    @Body()
    body: {
      orderPayment: paymentMethod;
      totalPriceTTC: number;
      totalPriceHT: number;
      adress?: any;
    },
  ): Promise<string> {
    console.log(body);
    return this.cartService.add_order(id_user, invoice, body);
  }
  @Post('edit-adresse/:id_user')
  @HttpCode(HttpStatus.OK)
  async edit_adresse(
    @Param('id_user') id_user: string,
    @Body() adresse: { state: string; city: string; street: string },
  ): Promise<string> {
    return '';
  }
}
