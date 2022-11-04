import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { user_shop } from 'src/app/models/user-shop.model';
import { AuthSelectors } from '../../auth/services/auth.selectors';
import { signIn } from 'src/app/auth/services/auth.actions';
import { getCartSelector } from '../services/cart.selectors';
import { car_parts } from '../../models/cars-parts.model';
import {
  first,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { CartService } from '../services/cart.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass'],
})
export class CheckoutComponent implements OnInit {
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
      }
      return;
    }
    if (step === 4) {
      this.checkoutStepper.next();
    }
  }

  editAdress(): void {
    this._bottomSheet.open(EditAdressComponent, {
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
  public awaitPaymentComplete(): void {
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
}

@Component({
  selector: 'app-edit-adress',
  templateUrl: './editAdress.component.html',
})
export class EditAdressComponent implements OnInit {
  streetRegex: RegExp = new RegExp(/^\s*\S+(?:\s+\S+){2}/);
  alwaysAdressEdit: boolean = false;
  adresse!: { state: string; city: string; street: string };
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<EditAdressComponent>,
    private store: Store,
    @Inject(MAT_BOTTOM_SHEET_DATA) public user: user_shop
  ) {}
  ngOnInit(): void {
    this.adresse = { ...this.user.adresse };
  }

  save() {
    if (this.alwaysAdressEdit) {
      // SAVE THE EDITED ADRESS
    }
    this.store.dispatch(signIn({ ...this.user, adresse: this.adresse }));
    this._bottomSheetRef.dismiss();
  }
  cancel() {
    this._bottomSheetRef.dismiss();
  }
}
