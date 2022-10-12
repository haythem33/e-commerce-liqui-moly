import { Component, OnInit } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  popular_products!: Observable<car_parts[]>;
  categorys_with_sub!: cars_category[];
  categorys_no_sub!: cars_category[];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProductsPopularity();
    this.getAllCategory();
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
}
