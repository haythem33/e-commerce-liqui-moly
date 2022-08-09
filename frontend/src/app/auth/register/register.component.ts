import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase/auth';
import { ReplaySubject, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  hide: boolean = true;
  public readonly passwordRegex: RegExp = new RegExp(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  );
  public readonly emailRegex: RegExp = new RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener!: () => void;
  private readonly destroyed$ = new Subject();
  constructor(
    private authService: AuthService,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
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
  public createAccount(user: NgForm): void {
    this.authService
      .open_missing_information_dialog({
        ...user.value,
        provider: 'INTERNAL',
        displayName: user.value.lastname + ' ' + user.value.name,
        photoURL: 'DEFAULT',
      })
      .afterClosed()
      .pipe(
        switchMap((complete_user) => {
          if (!complete_user) {
            throw 'PROCESS NOT COMPLETE';
          }
          return this.authService.send_user_data(complete_user, 'REGISTER');
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: async () => await this.authService.create_account(user.value),
        error: (err) => this.handleRegisterError(err),
      });
  }

  private handleRegisterError(err: any): void {
    if (err === 'PROCESS NOT COMPLETE') {
      return;
    }
    if (JSON.parse(err.error).message === 'USER ALEARDY EXIST') {
      this.snackBar.open(
        'UN COMPTE ET DEJA ASSOCIE AVEC CETTE ADRESSE',
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
