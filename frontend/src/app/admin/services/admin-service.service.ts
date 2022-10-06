import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { car_parts } from 'src/app/models/cars-parts.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminServiceService {
  constructor(private http: HttpClient) {}

  public add_cars_parts(car_part: FormData): Observable<any> {
    return this.http.post(
      environment.server_url + '/admin/addCarParts',
      car_part,
      {
        responseType: 'text',
      }
    );
  }
  public addCarsCategory(cars_category: FormData): Observable<any> {
    return this.http.post(
      environment.server_url + '/admin/addCarCategory',
      cars_category,
      {
        responseType: 'text',
      }
    );
  }
}
