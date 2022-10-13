import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, switchMap } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { car_parts } from 'src/app/models/cars-parts.model';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.sass'],
})
export class DetailProductComponent implements OnInit {
  product!: car_parts;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getProductById();
  }
  private getProductById() {
    this.route.params
      .pipe(
        switchMap((params) => this.productService.getProductById(params['id'])),
        first()
      )
      .subscribe({ next: (product) => (this.product = product) });
  }
}
