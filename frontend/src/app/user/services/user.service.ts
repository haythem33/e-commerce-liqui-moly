import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { signIn } from 'src/app/auth/services/auth.actions';
import { car_parts } from 'src/app/models/cars-parts.model';
import { cars } from 'src/app/models/cars.model';
import {
  user_shop,
  orderState,
  paymentMethod,
  order,
} from 'src/app/models/user-shop.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private store: Store) {}

  add_user_car(user: user_shop, user_car: cars): Observable<string> {
    return this.http
      .post(
        `${environment.server_url}/shop/add-user-cars/${user._id as string}`,
        user_car,
        {
          responseType: 'text',
        }
      )
      .pipe(
        tap({
          next: () =>
            this.store.dispatch(
              signIn({ ...user, cars: [...user.cars, user_car] })
            ),
        })
      );
  }
  remove_user_car(user_id: string, user_car: cars): Observable<string> {
    return this.http.post(
      `${environment.server_url}/shop/remove-user-cars/${user_id}`,
      user_car,
      {
        responseType: 'text',
      }
    );
  }
  get_ongoing_orders(user_id: string): Observable<order[]> {
    return this.http.get<order[]>(
      `${environment.server_url}/checkout/get-ongoing-orders/${user_id}`
    );
  }
  get_completed_orders(user_id: string): Observable<order[]> {
    return this.http.get<order[]>(
      `${environment.server_url}/checkout/get-completed-orders/${user_id}`
    );
  }
}
