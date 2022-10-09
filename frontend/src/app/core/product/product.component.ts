import { Component, Input, OnInit } from '@angular/core';
import { car_parts } from 'src/app/models/cars-parts.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass'],
})
export class ProductComponent implements OnInit {
  @Input('product') product!: car_parts;
  @Input('view') view!: 'carousel' | 'table' | 'large' | 'small';

  constructor() {}

  ngOnInit(): void {}
}
