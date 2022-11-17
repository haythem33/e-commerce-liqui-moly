import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { first, Subject, takeUntil } from 'rxjs';
import { signIn } from 'src/app/auth/services/auth.actions';
import { AuthSelectors } from 'src/app/auth/services/auth.selectors';
import { EditAdresseComponent } from 'src/app/cart/checkout/edit-adresse/edit-adresse.component';
import { user_shop } from 'src/app/models/user-shop.model';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.sass'],
})
export class GeneralInformationComponent implements OnInit, OnDestroy {
  user!: user_shop;
  adresse!: { state: string; city: string; street: string };
  destroyed: Subject<boolean> = new Subject<boolean>();
  constructor(private store: Store, private _bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {
    this.checkUserIsConntected();
  }
  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  editAdress(): void {
    this._bottomSheet
      .open(EditAdresseComponent, {
        data: { ...this.adresse, always: true },
      })
      .afterDismissed()
      .pipe(first())
      .subscribe({
        next: (adress) => {
          this.store.dispatch(signIn({ ...this.user, adresse: adress }));
          this.adresse = adress;
        },
      });
  }
  private checkUserIsConntected(): void {
    this.store
      .select(AuthSelectors)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (user) => {
          if (user !== null) {
            this.user = user;
            this.adresse = this.user.adresse;
            return;
          }
        },
      });
  }
}
