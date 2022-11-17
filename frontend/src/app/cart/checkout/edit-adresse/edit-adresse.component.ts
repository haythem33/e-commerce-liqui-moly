import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { catchError, first, switchMap, tap } from 'rxjs';
import { signIn } from 'src/app/auth/services/auth.actions';
import { AuthSelectors } from 'src/app/auth/services/auth.selectors';
import { user_shop } from 'src/app/models/user-shop.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-edit-adresse',
  templateUrl: './edit-adresse.component.html',
  styleUrls: ['./edit-adresse.component.sass'],
})
export class EditAdresseComponent implements OnInit {
  streetRegex: RegExp = new RegExp(/^\s*\S+(?:\s+\S+){2}/);
  alwaysAdressEdit: boolean = false;
  adresse!: { state: string; city: string; street: string };

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<EditAdresseComponent>,
    private store: Store,
    private cartService: CartService,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public user_adress: { state: string; city: string; street: string }
  ) {}

  ngOnInit(): void {
    this.adresse = { ...this.user_adress };
  }

  save() {
    console.log(this.alwaysAdressEdit);
    if (!this.alwaysAdressEdit) {
      this._bottomSheetRef.dismiss(this.adresse);
      return;
    }
    this.store
      .select(AuthSelectors)
      .pipe(
        switchMap((user) => {
          if (user === null) {
            throw 'NO USER FOUND';
          }
          return this.cartService.editUserAdresse(
            user._id as string,
            this.adresse
          );
        }),
        catchError((err) => {
          throw 'ERROR : ' + err;
        }),
        first()
      )
      .subscribe({
        next: () => this._bottomSheetRef.dismiss(this.adresse),
        error: (err) => console.error(err),
      });
  }
  cancel() {
    this._bottomSheetRef.dismiss(this.adresse);
  }
}
