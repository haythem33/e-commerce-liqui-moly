import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { User } from 'firebase/auth';
import {
  catchError,
  from,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Auth_Modal_Component } from '../auth-modal/auth-modal.component';
import { signIn } from '../services/auth.actions';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit, OnDestroy {
  hide: boolean = true;
  allSub: Subscription[] = [];
  mobileQuery!: MediaQueryList;
  public readonly passwordRegex: RegExp = new RegExp(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  );
  public readonly emailRegex: RegExp = new RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  private _mobileQueryListener!: () => void;
  private readonly destroyed$ = new Subject();
  constructor(
    private authService: AuthService,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<Auth_Modal_Component>,
    private store: Store<any>
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  google_login(): void {
    this.authService
      .google_login()
      .pipe(
        tap({ error: () => this.print_error('OPERATION ECHOUE') }),
        switchMap((user) =>
          this.authService.send_user_login({ ...user.user, provider: 'GOOGLE' })
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: (res) => this.store_user(res.user),
        error: (err) =>
          err.stack.message === 'MISSING INFORMATION'
            ? this.open_missing_information(err.user)
            : this.print_error('OPERATION ECHOUE'),
      });
  }

  native_login(user: NgForm): void {
    let { email, password } = user.value;
    this.authService
      .native_login(email, password)
      .pipe(
        tap({ error: () => this.print_error('INFORMATION INVALIDE') }),
        switchMap((user) =>
          this.authService.send_user_login({
            ...user.user,
            photoURL: 'DEFAULT',
            provider: 'INTERNAL',
          })
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: (res) => this.store_user(res.user),
        error: (err) =>
          err.stack.message === 'MISSING INFORMATION'
            ? this.open_missing_information(err.user)
            : console.log(err), // this.print_error('INFORMATION INVALIDE'),
      });
  }

  store_user(user: User): void {
    this.store.dispatch(signIn(user));
  }

  open_missing_information(user: User): void {
    this.authService.open_missing_information_dialog({
      type: 'LOGIN',
      user: user,
    });
    this.dialogRef.close();
  }

  print_error(message: string) {
    this.snackbar.open(message, 'Dismiss', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
