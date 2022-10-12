import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { first, Observable, Subject, takeUntil } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { cars } from 'src/app/models/cars.model';
import { ShopService } from 'src/app/shop/services/shop.service';
import { NgForm } from '@angular/forms';
import { AdminServiceService } from '../services/admin-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cars_category } from 'src/app/models/cars-category.model';
import { MatSelectChange } from '@angular/material/select';
import { ProductService } from 'src/app/core/services/product.service';
@Component({
  selector: 'app-add-cars-parts',
  templateUrl: './add-cars-parts.component.html',
  styleUrls: ['./add-cars-parts.component.sass'],
})
export class AddCarsPartsComponent implements OnInit, OnDestroy {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedCars: cars[] = [];
  destroy: Subject<boolean> = new Subject<boolean>();
  suggestionCars!: cars[];
  all_images_upload: File[] = [];
  all_preview_images: any[] = [];
  allCategory!: cars_category[];
  sub_category!: string[];
  @ViewChild('carInput') carInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private shopService: ShopService,
    private adminService: AdminServiceService,
    private productService: ProductService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
  ngOnInit(): void {
    this.productService
      .getProducts_Categorys()
      .pipe(first())
      .subscribe((res) => (this.allCategory = res));
  }

  remove(index: number): void {
    this.selectedCars.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCars.push(event.option.value);
    this.carInput.nativeElement.value = '';
    this.suggestionCars = [];
  }

  findCars(filter: string): void {
    this.shopService
      .filterCars(filter)
      .pipe(takeUntil(this.destroy))
      .subscribe({ next: (cars) => (this.suggestionCars = cars) });
  }
  async addFile(event: any): Promise<void> {
    this.all_images_upload = this.all_images_upload.concat(
      Array.from(event.target.files)
    );
    this.all_preview_images = await Promise.all(
      this.all_images_upload.map((image) => this._make_image_preview(image))
    );
  }

  removeFile(event: Event, index: number): void {
    event.stopPropagation();
    this.all_preview_images.splice(index, 1);
    this.all_images_upload.splice(index, 1);
    if (index === 0) {
      this.fileInput.nativeElement.value = '';
    }
  }
  public show_sub_categorie(event: MatSelectChange): void {
    if ((event.value as cars_category).sub_category !== undefined) {
      this.sub_category = (event.value as cars_category)
        .sub_category as string[];
    }
  }

  submit(carForm: NgForm): void {
    let car_part = new FormData();
    car_part.append('name', carForm.value.name);
    car_part.append('quantity', carForm.value.quantity);
    car_part.append('price', carForm.value.price);
    car_part.append('category', JSON.stringify(carForm.value.category));
    car_part.append('sub_category', carForm.value.sub_category);
    this.selectedCars.map((car) =>
      car_part.append('cars[]', JSON.stringify(car))
    );
    this.all_images_upload.map((file) => car_part.append('image_urls', file));
    this.adminService
      .add_cars_parts(car_part)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () =>
          this._snackBar.open('CAR PARTS ADDED SUCCESSFULLY', 'Dismiss', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }),
        error: (err) => {
          if (err.status === 409) {
            this._snackBar.open('CAR PARTS ALEARDY EXIST', 'Dismiss', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            return;
          }
          this._snackBar.open('SERVER ERROR', 'Dismiss', {
            duration: 200,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
      });
  }

  private _make_image_preview(image: File): Promise<any> {
    let file_reader = new FileReader();
    return new Promise((resolve, reject) => {
      file_reader.onload = (event) => resolve(event.target?.result);
      file_reader.onerror = (err) => reject(err);
      file_reader.readAsDataURL(image);
    });
  }
}
