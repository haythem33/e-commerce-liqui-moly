import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { car_parts } from 'src/app/models/cars-parts.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts_ByPopularity(): Observable<car_parts[]> {
    return this.http
      .get<car_parts[]>(`${environment.server_url}/shop/get_products`)
      .pipe(first());
  }
  getStaticFile(filename: string) {
    return this.http.get(
      `${environment.server_url}/core/static_file/${filename}`,
      {
        responseType: 'blob',
      }
    );
  }
  getProducts_Categorys() {}
  getProducts_NewStocks() {}
}
