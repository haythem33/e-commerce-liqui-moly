import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { car_parts } from 'src/app/models/cars-parts.model';
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
}
