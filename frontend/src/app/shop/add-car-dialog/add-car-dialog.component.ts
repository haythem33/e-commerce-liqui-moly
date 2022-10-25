import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { cars } from 'src/app/models/cars.model';

@Component({
  selector: 'app-add-car-dialog',
  templateUrl: './add-car-dialog.component.html',
  styleUrls: ['./add-car-dialog.component.sass'],
})
export class AddCarDialogComponent implements OnInit {
  car_make!: Observable<string[]>;
  car_model!: Observable<string[]>;
  car_year!: Observable<number[]>;
  carToFind: cars = { Make: '', Model: '', Year: 0, Category: '' };
  constructor(
    private productService: ProductService,
    private _bottomSheetRef: MatBottomSheetRef<AddCarDialogComponent>
  ) {}

  ngOnInit(): void {
    this.car_make = this.productService.getCarMake();
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
  cancel(): void {
    this._bottomSheetRef.dismiss();
  }
  addCar(): void {
    this._bottomSheetRef.dismiss(this.carToFind);
  }
}
