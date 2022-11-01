import { Component, Input, OnInit } from '@angular/core';
import { car_parts } from 'src/app/models/cars-parts.model';
import { ProductService } from '../services/product.service';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass'],
})
export class ProductComponent implements OnInit {
  @Input('product') product!: car_parts;
  @Input('view') view!: 'carousel' | 'table' | 'large' | 'cart';
  product_image!: Observable<SafeUrl> | Observable<SafeUrl>[];
  activeSlide: number = 0;
  fullWithOption: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    navSpeed: 600,
    dots: false,
    margin: 10,
    autoWidth: true,
    autoHeight: true,
    center: true,
    items: 1,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      760: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
    nav: false,
  };
  thumbnailsOption: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    navSpeed: 600,
    dots: false,
    margin: 6,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      760: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
    nav: false,
  };
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProductImage();
  }

  private getProductImage() {
    if (this.view === 'large') {
      this.product_image = this.product.image_urls.map((image) =>
        this.productService.getStaticFile(image as string)
      );
      return;
    }
    this.product_image = this.productService.getStaticFile(
      this.product.image_urls[0] as string
    );
  }
  public movedSlide(slide: SlidesOutputData) {
    this.activeSlide = slide.startPosition!;
  }
  public moveThumbNail(index: number) {
    if (index === this.activeSlide) {
      return;
    }
    this.activeSlide = index;
  }
  public addProduct_ToWhishlist() {}
}
