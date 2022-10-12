import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cars_category } from 'src/app/models/cars-category.model';
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
  getAllCategory(full: boolean): Observable<cars_category[]> {
    return this.http.get<cars_category[]>(
      `${environment.server_url}/shop/get_categorys/${full}`
    );
  }
}
