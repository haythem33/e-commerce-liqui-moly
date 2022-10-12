import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { car_parts } from 'src/app/models/cars-parts.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  popular_products!: Observable<car_parts[]>;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProductsPopularity();
  }
  private getProductsPopularity(): void {
    this.popular_products = this.productService.getProducts_ByPopularity();
  }
}
