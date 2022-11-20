import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { first, map, Observable, switchMap, tap } from 'rxjs';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';
import { cars } from 'src/app/models/cars.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getProductById(id: string): Observable<car_parts> {
    return this.http.get<car_parts>(
      `${environment.server_url}/shop/getProductBy_id/${id}`
    );
  }
  getAllProducts(): Observable<car_parts[]> {
    return this.http
      .get<car_parts[]>(`${environment.server_url}/shop/get_products`)
      .pipe(first());
  }
  getStaticFile(filename: string) {
    return this.http
      .get(`${environment.server_url}/core/static_file/${filename}`, {
        responseType: 'blob',
      })
      .pipe(
        map((file) =>
          this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))
        )
      );
  }
  getInvoicePdf(filename: string): Observable<Blob> {
    return this.http.get(
      `${environment.server_url}/core/static_file/${filename}`,
      {
        responseType: 'blob',
      }
    );
  }
  getProducts_Categorys() {
    return this.http.get<cars_category[]>(
      `${environment.server_url}/shop/get_categorys`
    );
  }
  getProducts_ByCars(car: cars): Observable<car_parts[]> {
    return this.http.get<car_parts[]>(
      `${environment.server_url}/shop/get_products_by_car`,
      {
        params: {
          make: car.Make,
          model: car.Model,
          year: car.Year,
        },
      }
    );
  }
  getCarMake(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.server_url}/shop/get_cars_make`
    );
  }
  getCarModel(make: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.server_url}/shop/get_car_model/${make}`
    );
  }
  getCarYear(make: string, model: string): Observable<number[]> {
    return this.http.get<number[]>(
      `${environment.server_url}/shop/get_car_year/${make}/${model}`
    );
  }
}
