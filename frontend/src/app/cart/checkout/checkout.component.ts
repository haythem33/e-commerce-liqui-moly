import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { paymentMethod, user_shop } from 'src/app/models/user-shop.model';
import { AuthSelectors } from '../../auth/services/auth.selectors';
import { getCartSelector } from '../services/cart.selectors';
import { car_parts } from '../../models/cars-parts.model';
import { first, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CartService } from '../services/cart.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { EditAdresseComponent } from './edit-adresse/edit-adresse.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ProductService } from 'src/app/core/services/product.service';
import { removeAllCart } from '../services/cart.actions';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  user!: user_shop;
  adresse!: { state: string; city: string; street: string };
  cart_list!: { car_part: car_parts; quantity: number }[];
  destroyed: Subject<boolean> = new Subject<boolean>();
  stepsComplete = {
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  };
  totalPrice: number = 0;
  paymentMethode: { bankTransfer: boolean; PayWithDeleviry: boolean } = {
    bankTransfer: false,
    PayWithDeleviry: false,
  };
  paymentLink!: SafeResourceUrl;
  stepperOrientation: Observable<StepperOrientation>;
  user_order!: {
    adress: { state: string; city: string; street: string };
    totalPriceTTC: number;
    totalPriceHT: number;
    orderPayment: paymentMethod;
    invoice: Blob;
  };
  cart_productsImages!: Observable<SafeUrl>[];
  @ViewChild('checkoutStepper') checkoutStepper!: MatStepper;
  @ViewChild('paymentFrame') paymentFrame!: ElementRef;
  constructor(
    private store: Store,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private cartService: CartService,
    breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    private productService: ProductService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.checkUserIsConntected();
  }
  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
  // PUBLIC METHOD
  nextStep(step: 1 | 2 | 3 | 4 | 5) {
    if (step === 1) {
      this.checkoutStepper.next();
      return;
    }
    if (step === 2) {
      this.checkoutStepper.next();
      if (this.paymentMethode.bankTransfer) {
        this.cartService
          .loadPayment(this.totalPrice * 1.2, this.user)
          .pipe(
            switchMap((res) => {
              return this.cartService.loadGateWay(res);
            }),
            first()
          )
          .subscribe({
            next: (res) => {
              if (res === 'Payment Failed') {
                return;
              }
              this.paymentLink =
                this.sanitizer.bypassSecurityTrustResourceUrl(res);
            },
          });
      } else {
        this.stepsComplete.step3 = true;
        this.nextStep(4);
      }
      return;
    }
    if (step === 5) {
      this.stepsComplete.step4 = true;
      this.checkoutStepper.next();
    }
  }
  editAdress(): void {
    this._bottomSheet
      .open(EditAdresseComponent, {
        data: { ...this.adresse },
      })
      .afterDismissed()
      .pipe(first())
      .subscribe({
        next: (adress) => {
          this.adresse = adress;
          this.user_order = { ...this.user_order, adress: adress };
        },
      });
  }
  addInvoice(file: Blob): void {
    this.user_order = { ...this.user_order, invoice: file };
    this.saveOrder();
    this.nextStep(5);
  }

  chosePayment(checkedIndex: 0 | 1): void {
    if (checkedIndex === 0) {
      this.paymentMethode.PayWithDeleviry = false;
      this.paymentMethode.bankTransfer = true;
      this.stepsComplete.step2 = true;
      this.user_order = {
        ...this.user_order,
        orderPayment: paymentMethod.bankTransfer,
      };
      return;
    }
    this.paymentMethode.PayWithDeleviry = true;
    this.paymentMethode.bankTransfer = false;
    this.stepsComplete.step2 = true;
    this.user_order = {
      ...this.user_order,
      orderPayment: paymentMethod.PayWithDeleviry,
    };
  }
  PaymentComplete(): void {
    if (!this.paymentFrame) {
      return;
    }
    window.addEventListener('message', (event: any) => {
      if (event.data.event_id === 'paymee.complete') {
        this.stepsComplete.step3 = true;
        this.nextStep(4);
        window.removeEventListener('message', () => {});
      }
    });
  }

  // PRIVATE METHOD
  private checkUserIsConntected(): void {
    this.store
      .select(AuthSelectors)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (user) => {
          if (user !== null) {
            this.user = user;
            this.adresse = this.user.adresse;
            this.loadCart();
            return;
          }
        },
      });
  }
  private loadCart(): void {
    this.store
      .select(getCartSelector)
      .pipe(first())
      .subscribe((cart) => {
        if (cart.length === 0) {
          this.router.navigate(['/shop']);
          return;
        }
        this.cart_list = cart;
        this.generateProductsImage();
        this.calculateCartSum();
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
    this.user_order = {
      ...this.user_order,
      totalPriceHT: this.totalPrice,
      totalPriceTTC: this.totalPrice * 1.2,
    };
  }
  private saveOrder(): void {
    let formData = new FormData();
    if (this.adresse) {
      formData.append('adress', JSON.stringify(this.user_order.adress));
    }
    formData.append(
      'totalPriceTTC',
      JSON.stringify(this.user_order.totalPriceTTC)
    );
    formData.append(
      'totalPriceHT',
      JSON.stringify(this.user_order.totalPriceHT)
    );
    formData.append('invoice', this.user_order.invoice);
    this.cartService
      .sendOrder(this.user._id as string, formData)
      .pipe(first())
      .subscribe({
        next: () => this.store.dispatch(removeAllCart()),
        error: (err) => console.error(err),
      });
  }
}
