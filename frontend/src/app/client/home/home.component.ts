import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, map, Observable } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';
import { cars } from 'src/app/models/cars.model';
import { queryProductByCar } from '../services/client.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  popular_products!: Observable<car_parts[]>;
  categorys_with_sub!: cars_category[];
  categorys_no_sub!: cars_category[];
  car_make!: Observable<string[]>;
  car_model!: Observable<string[]>;
  car_year!: Observable<number[]>;
  carToFind: cars = { Make: '', Model: '', Year: 0, Category: '' };
  constructor(
    private productService: ProductService,
    private store: Store<any>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProductsPopularity();
    this.getAllCategory();
    this.car_make = this.productService.getCarMake();
  }
  private getProductsPopularity(): void {
    this.popular_products = this.productService.getProducts_ByPopularity();
  }
  private getAllCategory() {
    this.productService
      .getProducts_Categorys()
      .pipe(first())
      .subscribe({
        next: (allCategory) => {
          this.splitCategory(
            allCategory.map((category) => {
              category.image_url = this.productService.getStaticFile(
                category.image_url as string
              );
              return category;
            })
          );
        },
      });
  }
  private splitCategory(allCategory: cars_category[]) {
    this.categorys_with_sub = allCategory.filter(
      (category) => category.sub_category && category.sub_category.length > 0
    );
    this.categorys_no_sub = allCategory.filter(
      (category) => !category.sub_category || category.sub_category.length === 0
    );
  }
  getCarModel() {
    this.car_model = this.productService.getCarModel(this.carToFind.Make);
  }
  getCarYear() {
    this.car_year = this.productService.getCarYear(
      this.carToFind.Make,
      this.carToFind.Model
    );
  }
  async searchProductByCar(): Promise<void> {
    this.store.dispatch(queryProductByCar(this.carToFind));
    await this.router.navigate(['shop']);
  }
}
