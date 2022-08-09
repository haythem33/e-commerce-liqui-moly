import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase/auth';
import { Observable, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
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
    private snackBar: MatSnackBar,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef
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
  public async google_login(): Promise<void> {
    let user = await this.authService.google_login();
    this.authService
      .send_user_data(user, 'LOGIN')
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => this.handleLoginError(JSON.parse(err.error), user),
      });
  }
  public async facebook_login(): Promise<void> {}

  public async nativeLogin(user: NgForm): Promise<void> {
    let userCredential = await this.authService.native_login(user.value);
    console.log(userCredential);
    if (!userCredential) {
      this.snackBar.open(
        "AUCUN COMPTE N'A ETE TROUVE AVEC CETTE ADRESSE MAIL",
        'Dismiss',
        {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        }
      );
      return;
    }
    this.authService
      .send_user_data(userCredential, 'LOGIN')
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => console.log(res),
        error: (err) =>
          this.handleLoginError(JSON.parse(err.error), userCredential),
      });
  }

  private handleLoginError(error: any, user: User): void {
    if (error.message === 'MISSING INFORMATION') {
      this.authService
        .open_missing_information_dialog(user)
        .afterClosed()
        .pipe(
          switchMap((complete_user) => {
            if (!complete_user) {
              throw 'PROCESS NOT COMPLETE';
            }
            return this.authService.send_user_data(complete_user, 'LOGIN');
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => this.handleLoginError(JSON.parse(err.error), user),
        });
      return;
    }
    if (error.message === 'USER NOT FOUND') {
      this.snackBar.open(
        "AUCUN COMPTE N'A ETE TROUVE AVEC CETTE ADRESSE MAIL",
        'Dismiss',
        {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        }
      );
    }
  }
}
