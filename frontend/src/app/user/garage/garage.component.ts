import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { catchError, first, Subject, switchMap, takeUntil } from 'rxjs';
import { signIn } from 'src/app/auth/services/auth.actions';
import { AuthSelectors } from 'src/app/auth/services/auth.selectors';
import { cars } from 'src/app/models/cars.model';
import { user_shop } from 'src/app/models/user-shop.model';
import { AddCarDialogComponent } from 'src/app/shop/add-car-dialog/add-car-dialog.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.sass'],
})
export class GarageComponent implements OnInit {
  allCars: cars[] = [];
  user!: user_shop;
  destroyed: Subject<boolean> = new Subject<boolean>();
  constructor(
    private _bottomSheet: MatBottomSheet,
    private store: Store,
    private userService: UserService,
    private snakBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkUserIsConntected();
  }

  addCar(): void {
    this._bottomSheet
      .open(AddCarDialogComponent, {
        autoFocus: true,
      })
      .afterDismissed()
      .pipe(
        switchMap((user_car) => {
          if (!user_car) {
            throw 'ADD CAR CANCELED';
          }
          return this.userService.add_user_car(this.user, user_car);
        }),
        catchError((err) => {
          throw err;
        }),
        first()
      )
      .subscribe({
        error: (err) => {
          if (err === 'ADD CAR CANCELED') {
            return;
          }
          this.snakBar.open('VEHICULE DEJA EXISTANTE', 'Dismiss', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 2000,
          });
        },
      });
  }
  removeCar(user_car: cars): void {
    this.userService
      .remove_user_car(this.user._id as string, user_car)
      .pipe(first())
      .subscribe({
        next: () =>
          this.store.dispatch(
            signIn({
              ...this.user,
              cars: this.user.cars.filter(
                (car) =>
                  car.Make !== user_car.Make &&
                  car.Model !== user_car.Model &&
                  car.Year !== user_car.Year
              ),
            })
          ),
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
            this.allCars = this.user.cars;
            return;
          }
        },
      });
  }
}
