import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cars } from 'src/app/models/cars.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private http: HttpClient) {}

  filterCars(filter: string): Observable<cars[]> {
    return this.http.get<cars[]>(`${environment.server_url}/shop/filter_car`, {
      params: new HttpParams().set('car_filter', filter),
    });
  }
}
