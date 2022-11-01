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
import { loadUserCart } from '../services/cart.actions';
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
    private authService: AuthService,
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
