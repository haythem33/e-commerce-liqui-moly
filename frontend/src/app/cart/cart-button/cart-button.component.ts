import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { first, Observable, Subject, takeUntil } from 'rxjs';
import { AuthSelectors } from 'src/app/auth/services/auth.selectors';
import { AuthService } from 'src/app/auth/services/auth.service';
import { car_parts } from 'src/app/models/cars-parts.model';
import { user_shop } from 'src/app/models/user-shop.model';
import { getCartSelector } from '../services/cart.selectors';
import {
  addProductToCart,
  loadUserCart,
  removeProductFromCart,
} from '../services/cart.actions';
import { CartService } from '../services/cart.service';
import { SafeUrl } from '@angular/platform-browser';
import { ProductService } from 'src/app/core/services/product.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.sass'],
})
export class CartButtonComponent implements OnInit, OnDestroy {
  @Input('view') view!: 'fullButton' | 'CarouselButton' | 'NavButton';
  @Input('product') product!: car_parts;

  user!: user_shop | null;
  checkPrduct!: boolean;
  destroyed: Subject<boolean> = new Subject();
  cart_list!: Array<{ car_part: car_parts; quantity: number }>;
  totalPrice: number = 0;
  cart_productsImages!: Observable<SafeUrl>[];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.checkUserIsConnected();
  }
  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  add(): void {
    if (this.user === null) {
      this.authService.open_auth_dialog();
      return;
    }
    this.cartService
      .addProductCart(
        {
          car_part_id: this.product._id as string,
          quantity: 1,
        },
        this.user._id as string
      )
      .pipe(first())
      .subscribe({
        next: () =>
          this.store.dispatch(
            addProductToCart({ car_part: this.product, quantity: 1 })
          ),
        error: (err) => console.error(err),
      });
  }
  remove(): void {
    if (this.user === null) {
      this.authService.open_auth_dialog();
      return;
    }
    this.cartService
      .deleteProductCart(this.user._id as string, this.product._id as string)
      .pipe(first())
      .subscribe({
        next: () =>
          this.store.dispatch(
            removeProductFromCart({ _id: this.product._id as string })
          ),
        error: (err) => console.error(err),
      });
  }
  private checkPrductCart(): void {
    this.store
      .select(getCartSelector)
      .pipe(takeUntil(this.destroyed))
      .subscribe((cart) => {
        this.checkPrduct = cart.some(
          (part) => part.car_part._id === this.product._id
        );
      });
  }
  private checkUserIsConnected(): void {
    this.store
      .select(AuthSelectors)
      .pipe(takeUntil(this.destroyed))
      .subscribe((user) => {
        this.user = user;
        if (user !== null) {
          if (this.view === 'fullButton' || this.view === 'CarouselButton') {
            this.checkPrductCart();
            return;
          }
          if (this.view === 'NavButton') {
            this.loadCart();
          }
        }
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
