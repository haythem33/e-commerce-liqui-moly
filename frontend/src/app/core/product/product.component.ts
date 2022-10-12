import { Component, Input, OnInit } from '@angular/core';
import { car_parts } from 'src/app/models/cars-parts.model';
import { ProductService } from '../services/product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass'],
})
export class ProductComponent implements OnInit {
  @Input('product') product!: car_parts;
  @Input('view') view!: 'carousel' | 'table' | 'large' | 'small';
  product_image!: SafeUrl;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProductImage();
  }

  private getProductImage() {
    this.productService
      .getStaticFile(this.product.image_urls[0] as string)
      .subscribe((res) => {
        this.product_image = res;
      });
  }

  public addProduct_ToWhishlist() {}

  public addProduct_ToCart() {}
}
