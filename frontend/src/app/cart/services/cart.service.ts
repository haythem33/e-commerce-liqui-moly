import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { car_parts } from 'src/app/models/cars-parts.model';
import { paymentMethod, user_shop } from 'src/app/models/user-shop.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  addProductCart(
    body: {
      car_part_id: string;
      quantity: number;
    },
    id_user: string
  ): Observable<any> {
    return this.http.post(
      `${environment.server_url}/cart/add-product/${id_user}`,
      body,
      {
        responseType: 'text',
      }
    );
  }
  deleteProductCart(id_user: string, id_product: string): Observable<any> {
    return this.http.delete(
      `${environment.server_url}/cart/remove-product/${id_user}/${id_product}`,
      {
        responseType: 'text',
      }
    );
  }
  getUserCart(
    id_user: string
  ): Observable<{ car_part: car_parts; quantity: number }[]> {
    return this.http.get<{ car_part: car_parts; quantity: number }[]>(
      `${environment.server_url}/cart/get-user-cart/${id_user}`
    );
  }
  loadPayment(sum: number, user: user_shop): Observable<any> {
    return this.http.post(
      `${environment.paymeeConfig.api_url}/api/v1/payments/create`,
      {
        vendor: environment.paymeeConfig.accountNum,
        amount: sum,
        note: `${user.email}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${environment.paymeeConfig.token}`,
        },
      }
    );
  }
  loadGateWay(res: any): Observable<any> {
    if (res.message !== 'Success') {
      return of('Payment Failed');
    }
    return of(`https://sandbox.paymee.tn/gateway/${res.data.token}`);
  }
  sendOrder(user_id: string, order: FormData): Observable<string> {
    return this.http.post(
      `${environment.server_url}/checkout/add-order/${user_id}`,
      order,
      {
        responseType: 'text',
      }
    );
  }
}
