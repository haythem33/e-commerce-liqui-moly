import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CartService } from './services/cart.service';

@Controller({
  path: 'cart',
  version: '1',
})
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add-product/:id_user')
  @HttpCode(HttpStatus.OK)
  async addProduct(
    @Param('id_user') id: string,
    @Body() body: { car_part_id: string; quantity: number },
  ): Promise<string> {
    return this.cartService.addProduct(id, body);
  }
  @Delete('remove-product/:id_user/:id_product')
  @HttpCode(HttpStatus.OK)
  async removeProduct(
    @Param('id_user') id: string,
    @Param('id_product') id_product,
  ): Promise<string> {
    return this.cartService.removeProduct(id, id_product);
  }
}
