import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { cars_category } from 'src/app/models/cars-category.model';
import { AdminServiceService } from '../services/admin-service.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.sass'],
})
export class AddCategoryComponent implements OnInit {
  imagePreview!: any;
  categoryImage!: File | null;
  constructor(
    private adminService: AdminServiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  async addFile(event: any) {
    this.categoryImage = event.target.files[0];
    this.imagePreview = await this._make_image_preview(event.target.files[0]);
  }
  removeFile() {
    this.imagePreview = null;
    this.categoryImage = null;
  }

  submit(category: NgForm) {
    if (this.categoryImage === null) {
      this.snackBar.open('VOUS DEVEZ CHOISIR UNE IMAGE', 'Dismiss', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }
    let cars_category = new FormData();
    cars_category.append('name', category.value.name);
    cars_category.append('image_url', this.categoryImage);
    this.adminService
      .addCarsCategory(cars_category)
      .pipe(first())
      .subscribe({
        next: () =>
          this.snackBar.open('CATEGORIES AJOUTER AVEC SUCCESS', 'Dismiss', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }),
        error: (err) => {
          console.log(err);
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
