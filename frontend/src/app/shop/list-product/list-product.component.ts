import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSelectionList } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { first, Observable, share, switchMap } from 'rxjs';
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
  products!: Observable<car_parts[]>;
  allCategorys!: cars_category[];
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
    this.getCategorys();
  }

  private getProducts(): void {
    this.getQuery()
      .pipe(first())
      .subscribe({
        next: (query) =>
          (this.products = this.querySwitch(query.query_type, query.value)),
      });
  }
  private getCategorys(): void {
    this.productService
      .getProducts_Categorys()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.allCategorys = res;
          this.getProducts();
          this.allBrands = this.productService.getCarMake();
        },
      });
  }
  private getQuery(): Observable<{
    query_type: 'CARS' | 'CATEGORY' | 'CAR_PARTS' | null;
    value: cars | car_parts | cars_category | null;
  }> {
    return this.store.select(querySelector);
  }
  private querySwitch(
    query_type: 'CARS' | 'CATEGORY' | 'CAR_PARTS' | null,
    value: cars | car_parts | cars_category | null
  ): Observable<car_parts[]> {
    if (!query_type || !value) {
      return this.productService.getAllProducts();
    }
    if (query_type === 'CARS') {
      this.allCars.push(value as cars);
      this.allFilters.car.push(value as cars);
      return this.productService.getProducts_ByCars(value as cars);
    }
    // if (<car_parts>query) {

    // }
    if (query_type === 'CATEGORY') {
      let categoryIndex = this.allCategorys.findIndex(
        (ca) => ca._id === (value as cars_category)._id
      );
      this.allCategorys[categoryIndex] = value as cars_category;
      this.allFilters.category.push(value as cars_category);
      return this.productService.getProductsByCategory(
        (value as cars_category)._id as string
      );
    }
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
    if (this.allFilters.car.length > 0) {
      this.brandsSelect.deselectAll();
      this.brandsSelect.disabled = true;
    }
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
