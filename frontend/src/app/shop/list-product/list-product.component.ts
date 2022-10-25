import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSelectionList } from '@angular/material/list';
import { MatSlider } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { catchError, first, Observable, switchMap, tap } from 'rxjs';
import { querySelector } from 'src/app/client/services/client.selectors';
import { ProductService } from 'src/app/core/services/product.service';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';
import { cars } from 'src/app/models/cars.model';
import { AddCarDialogComponent } from '../add-car-dialog/add-car-dialog.component';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.sass'],
})
export class ListProductComponent implements OnInit {
  query!: cars | car_parts | cars_category | null;
  products!: Observable<car_parts[]>;
  allCategorys!: Observable<cars_category[]>;
  allCars: cars[] = [];
  allBrands!: Observable<string[]>;

  allFilters: {
    category: cars_category[];
    subCategory: string[];
    car: cars[];
    price: { max: number; min: number };
    brand: string[];
  } = {
    category: [],
    subCategory: [],
    car: [],
    price: { max: 0, min: 0 },
    brand: [],
  };
  @ViewChild('carsSelect') carsSelect!: MatSelectionList;
  @ViewChild('brandsSelect') brandsSelect!: MatSelectionList;
  @ViewChild('categorySelect') categorySelect!: MatSelectionList;
  @ViewChild('subCategorySelect') subCategorySelect!: MatSelectionList;
  constructor(
    private store: Store,
    private productService: ProductService,
    private _bottomSheet: MatBottomSheet,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getCategorys();
    this.allBrands = this.productService.getCarMake();
  }

  private getProducts(): void {
    this.products = this.getQuery().pipe(
      switchMap((query) => this.querySwitch(query))
    );
  }
  private getCategorys(): void {
    this.allCategorys = this.productService
      .getProducts_Categorys()
      .pipe(first());
  }
  private getQuery(): Observable<cars | car_parts | cars_category | null> {
    return this.store.select(querySelector);
  }
  private querySwitch(
    query: cars | car_parts | cars_category | null
  ): Observable<car_parts[]> {
    if (<cars>query) {
      this.allCars.push(query as cars);
      this.allFilters.car.push(query as cars);
      return this.productService.getProducts_ByCars(query as cars);
    }
    // if (<car_parts>query) {

    // }
    // if(<cars_category>query) {

    // }
    return this.productService.getAllProducts();
  }
  addCar(): void {
    this._bottomSheet
      .open(AddCarDialogComponent, {
        autoFocus: true,
      })
      .afterDismissed()
      .subscribe({
        next: (result) => {
          if (result) {
            this.allCars.push(result);
          }
        },
      });
  }
  applyFilter(): void {
    console.log(this.allFilters);
    this.products = this.shopService.fullFilter(this.allFilters);
  }
  resetFilter(): void {
    this.allFilters = {
      category: [],
      subCategory: [],
      car: [],
      price: { max: 0, min: 0 },
      brand: [],
    };
  }
  removeSubCategory() {
    if (this.allFilters.subCategory.length > 0) {
      this.allFilters.subCategory = [];
      this.allFilters.category = [this.allFilters.category[0]];
    }
  }
  removeFilter(
    more: 'CAR' | 'CATEGORY' | 'SUBCATEGORY' | 'BRAND' | 'MAX' | 'MIN',
    index?: number
  ): void {
    if (more === 'CAR') {
      this.carsSelect.selectedOptions.deselect(
        this.carsSelect.selectedOptions.selected[index as number]
      );
      return;
    }
    if (more === 'CATEGORY') {
      this.categorySelect.selectedOptions.deselect(
        this.categorySelect.selectedOptions.selected[index as number]
      );
      this.allFilters.category = [];
      this.subCategorySelect.deselectAll();
      return;
    }
    if (more === 'SUBCATEGORY') {
      this.subCategorySelect.selectedOptions.deselect(
        this.subCategorySelect.selectedOptions.selected[index as number]
      );
    }
    if (more === 'BRAND') {
      this.brandsSelect.selectedOptions.deselect(
        this.brandsSelect.selectedOptions.selected[index as number]
      );
      return;
    }
    if (more === 'MAX') {
      this.allFilters.price.max = 0;
      return;
    }
    if (more === 'MIN') {
      this.allFilters.price.min = 0;
      return;
    }
  }
}
