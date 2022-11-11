import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { signIn } from 'src/app/auth/services/auth.actions';
import { user_shop } from 'src/app/models/user-shop.model';

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
