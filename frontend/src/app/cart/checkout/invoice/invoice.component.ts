import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthSelectors } from 'src/app/auth/services/auth.selectors';
import { user_shop } from 'src/app/models/user-shop.model';
import { getCartSelector } from '../../services/cart.selectors';
import { Router } from '@angular/router';
import { car_parts } from 'src/app/models/cars-parts.model';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.sass'],
})
export class InvoiceComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input('payment') payment!: 'bankTransfer' | 'PayWithDeleviry';
  destroyed = new Subject<boolean>();
  user!: user_shop;
  cart_list!: { car_part: car_parts; quantity: number }[];
  totalPrice: number = 0;
  date_facture = Date.now();
  pdfProgress: boolean = true;
  @ViewChild('invoice') pdfView!: ElementRef;
  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.checkUserIsConntected();
  }
  ngAfterViewInit(): void {
    this.generatePdf();
  }
  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
  // PRIVATE METHOD

  private checkUserIsConntected(): void {
    this.store
      .select(AuthSelectors)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (user) => {
          if (user !== null) {
            this.user = user;
            this.loadCart();
            return;
          }
        },
      });
  }
  private loadCart(): void {
    this.store
      .select(getCartSelector)
      .pipe(takeUntil(this.destroyed))
      .subscribe((cart) => {
        if (cart.length === 0) {
          this.router.navigate(['/shop']);
          return;
        }
        this.cart_list = cart;
        this.calculateCartSum();
      });
  }
  private calculateCartSum(): void {
    this.totalPrice = this.cart_list.reduce(
      (prevVal, currentVal) =>
        prevVal + currentVal.car_part.price * currentVal.quantity,
      0
    );
  }
  private async generatePdf(): Promise<void> {
    if (!this.pdfView) {
      return;
    }
    let pdf = new jsPDF({
      putOnlyUsedFonts: true,
      orientation: 'l',
      unit: 'pt',
      format: [
        this.pdfView.nativeElement.offsetWidth,
        this.pdfView.nativeElement.offsetHeight,
      ],
    });
    pdf.html(this.pdfView.nativeElement, {
      callback: async (doc: jsPDF) => {},
    });
  }
  public savePdf(): void {
    this.pdfView.nativeElement.remove();
  }
}
