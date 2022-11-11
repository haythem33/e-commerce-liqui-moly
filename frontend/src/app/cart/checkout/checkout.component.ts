import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { user_shop } from 'src/app/models/user-shop.model';
import { AuthSelectors } from '../../auth/services/auth.selectors';
import { getCartSelector } from '../services/cart.selectors';
import { car_parts } from '../../models/cars-parts.model';
import { first, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CartService } from '../services/cart.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EditAdresseComponent } from './edit-adresse/edit-adresse.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  user!: user_shop;
  cart_list!: { car_part: car_parts; quantity: number }[];
  destroyed: Subject<boolean> = new Subject<boolean>();
  stepsComplete = { step1: true, step2: false, step3: false, step4: false };
  totalPrice: number = 0;
  paymentMethode: { bankTransfer: boolean; PayWithDeleviry: boolean } = {
    bankTransfer: false,
    PayWithDeleviry: false,
  };
  paymentLink!: SafeResourceUrl;
  stepperOrientation: Observable<StepperOrientation>;
  @ViewChild('checkoutStepper') checkoutStepper!: MatStepper;
  @ViewChild('paymentFrame') paymentFrame!: ElementRef;
  constructor(
    private store: Store,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private cartService: CartService,
    breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer
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
  nextStep(step: 1 | 2 | 3 | 4) {
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
                console.log(res);
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
    if (step === 4) {
      this.checkoutStepper.next();
    }
  }
  editAdress(): void {
    this._bottomSheet.open(EditAdresseComponent, {
      data: { ...this.user },
    });
  }

  chosePayment(checkedIndex: 0 | 1): void {
    if (checkedIndex === 0) {
      this.paymentMethode.PayWithDeleviry = false;
      this.paymentMethode.bankTransfer = true;
      this.stepsComplete.step2 = true;
      return;
    }
    this.paymentMethode.PayWithDeleviry = true;
    this.paymentMethode.bankTransfer = false;
    this.stepsComplete.step2 = true;
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
            this.loadCart();
            return;
          }
        },
      });
  }
  private loadCart(): void {
    this.store
      .select(getCartSelector)
      .pipe(takeUntil(this.destroyed))
      .subscribe((cart) => {
        if (cart.length === 0) {
          this.router.navigate(['/shop']);
          return;
        }
        this.cart_list = cart;
        this.calculateCartSum();
      });
  }
  private calculateCartSum(): void {
    this.totalPrice = this.cart_list.reduce(
      (prevVal, currentVal) =>
        prevVal + currentVal.car_part.price * currentVal.quantity,
      0
    );
  }
}
