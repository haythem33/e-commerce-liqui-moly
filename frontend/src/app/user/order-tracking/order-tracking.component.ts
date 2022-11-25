import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { FileSaverService } from 'ngx-filesaver';
import { first, Observable, Subject, takeUntil } from 'rxjs';
import { AuthSelectors } from 'src/app/auth/services/auth.selectors';
import { ProductService } from 'src/app/core/services/product.service';
import { order, user_shop } from 'src/app/models/user-shop.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.sass'],
})
export class OrderTrackingComponent implements OnInit {
  destroyed: Subject<boolean> = new Subject<boolean>();
  user!: user_shop;
  pending_orders: order[] = [];
  cart_productsImages!: Observable<SafeUrl>[];
  orders_states!: number[];
  invoice_files: Observable<{ url: string | null; file: Blob }>[] = [];
  constructor(
    private store: Store,
    private userService: UserService,
    private productService: ProductService,
    private fileSaverService: FileSaverService
  ) {}

  ngOnInit(): void {
    this.checkUserIsConntected();
  }
  saveInvoice(index: number): void {
    this.invoice_files[index].pipe(first()).subscribe({
      next: (res) =>
        this.fileSaverService.save(
          res.file,
          `facture-${this.user.displayName}-commande-${index + 1}.pdf`
        ),
    });
  }
  private checkUserIsConntected(): void {
    this.store
      .select(AuthSelectors)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (user) => {
          if (user !== null) {
            this.user = user;
            this.getPendingUserOrders(this.user._id as string);
            return;
          }
        },
      });
  }
  private getPendingUserOrders(user_id: string) {
    this.userService
      .get_ongoing_orders(user_id)
      .pipe(first())
      .subscribe({
        next: (orders) => {
          this.pending_orders = orders;
          this.generateProductsImage();
          this.arrangeOrdersState();
          this.generateInvoiceFiles();
        },
      });
  }
  private generateProductsImage(): void {
    this.cart_productsImages = this.pending_orders.flatMap((order) =>
      order.order.map((product) =>
        this.productService.getStaticFile(
          product.car_part.image_urls[0] as string
        )
      )
    );
  }
  private arrangeOrdersState(): void {
    this.orders_states = this.pending_orders.map((order) => {
      if (order.orderStatus === 'EN ATTENTE DE LIVRAISON') {
        return 0;
      }
      if (order.orderStatus === 'EN COURS DE LIVRAISON') {
        return 1;
      }
      return 2;
    });
  }
  private generateInvoiceFiles(): void {
    this.invoice_files = this.pending_orders.map(
      (order) =>
        this.productService.getInvoicePdf(order.orderInvoiceUrl).pipe(first())!
    );
  }
}
