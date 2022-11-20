import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';
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
  fullFilter(allFilter: {
    category: cars_category[];
    subCategory: string[];
    car: cars[];
    price: { max: number; min: number };
    brand: string[];
  }): Observable<car_parts[]> {
    return this.http.get<car_parts[]>(
      `${environment.server_url}/shop/fullFilter`,
      {
        params: {
          category: JSON.stringify(allFilter.category),
          subCategory: JSON.stringify(allFilter.subCategory),
          car: JSON.stringify(allFilter.car),
          price: JSON.stringify(allFilter.price),
          brand: JSON.stringify(allFilter.brand),
        },
      }
    );
  }
}
