import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'firebase/auth';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthSelectors } from './services/auth.selectors';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass'],
})
export class AuthComponent implements OnInit, OnDestroy {
  user!: User | null;
  private readonly destroyed = new Subject<boolean>();
  constructor(private authService: AuthService, private store: Store<any>) {}

  ngOnInit(): void {
    this.auth_state();
  }
  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
  auth_state(): void {
    this.store
      .select(AuthSelectors)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (user) => (this.user = user),
        error: (err) => console.error(err),
      });
  }
  openModel() {
    this.authService.open_auth_dialog();
  }
}
