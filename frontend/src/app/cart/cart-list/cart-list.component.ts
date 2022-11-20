import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, Observable, Subject, takeUntil } from 'rxjs';
import { AuthSelectors } from 'src/app/auth/services/auth.selectors';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';
import { car_parts } from 'src/app/models/cars-parts.model';
import { user_shop } from 'src/app/models/user-shop.model';
import {
  addProductQuantity,
  loadUserCart,
  removeProductQuantity,
} from '../services/cart.actions';
import { getCartSelector } from '../services/cart.selectors';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.sass'],
})
export class CartListComponent implements OnInit, OnDestroy {
  user!: user_shop | null;
  destroyed: Subject<boolean> = new Subject();
  cart_list!: Array<{ car_part: car_parts; quantity: number }>;
  totalPrice: number = 0;
  cart_productsImages!: Observable<SafeUrl>[];
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserIsConnected();
  }
  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
  updateQuantity(
    cart: { car_part: car_parts; quantity: number },
    operation: 'ADD' | 'REMOVE'
  ): void {
    if (operation === 'ADD') {
      if (cart.quantity === cart.car_part.quantity) {
        return;
      }
      this.store.dispatch(
        addProductQuantity({ _id: cart.car_part._id as string })
      );
      this.saveChanges({ ...cart, quantity: cart.quantity + 1 });
      return;
    }
    if (operation === 'REMOVE') {
      if (cart.quantity - 1 === 0) {
        return;
      }
      this.store.dispatch(
        removeProductQuantity({ _id: cart.car_part._id as string })
      );
      this.saveChanges({ ...cart, quantity: cart.quantity - 1 });
      return;
    }
  }
  saveChanges(cart: { car_part: car_parts; quantity: number }): void {
    this.cartService
      .addProductCart(
        {
          car_part_id: cart.car_part._id as string,
          quantity: cart.quantity,
        },
        this.user?._id as string
      )
      .pipe(first())
      .subscribe({
        error: (err) => {
          console.log(err);
        },
      });
  }
  private checkUserIsConnected(): void {
    this.store
      .select(AuthSelectors)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (user) => {
          if (user === null) {
            this.router.navigate(['/shop']);
            return;
          }
          this.user = user;
          this.loadCart();
        },
      });
  }
  private loadCart(): void {
    // LOAD FIRST CART
    this.cartService
      .getUserCart(this.user?._id as string)
      .pipe(first())
      .subscribe({
        next: (cart) => this.store.dispatch(loadUserCart({ allCart: cart })),
      });
    // LISTEN TO CHANGES
    this.store
      .select(getCartSelector)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (cart) => {
          this.cart_list = cart;
          this.generateProductsImage();
          this.calculateCartSum();
        },
      });
  }
  private generateProductsImage(): void {
    this.cart_productsImages = this.cart_list.map((part) =>
      this.productService.getStaticFile(part.car_part.image_urls[0] as string)
    );
  }
  private calculateCartSum(): void {
    this.totalPrice = this.cart_list.reduce(
      (prevVal, currentVal) =>
        prevVal + currentVal.car_part.price * currentVal.quantity,
      0
    );
  }
}
