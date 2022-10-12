import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { first, map, Observable, switchMap, tap } from 'rxjs';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getProducts_ByPopularity(): Observable<car_parts[]> {
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
  getProducts_Categorys() {
    return this.http.get<cars_category[]>(
      `${environment.server_url}/shop/get_categorys`
    );
  }
  getProducts_NewStocks() {}
}
