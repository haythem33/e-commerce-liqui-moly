import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase/auth';
import { ReplaySubject, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Auth_Modal_Component } from '../auth-modal/auth-modal.component';
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
  private readonly destroyed = new Subject();
  constructor(
    private authService: AuthService,
    private media: MediaMatcher,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<Auth_Modal_Component>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
  register(user: NgForm): void {
    this.authService
      .create_user(user.value.email, user.value.password)
      .pipe(
        tap({ error: (err) => this.handleFireError(err.code) }),
        takeUntil(this.destroyed)
      )
      .subscribe({
        next: () => {
          this.authService.open_missing_information_dialog({
            type: 'REGISTER',
            user: {
              ...user.value,
              displayName: user.value.name + ' ' + user.value.lastname,
              photoURL: 'DEFAULT',
              provider: 'INTERNAL',
            },
          });
          this.dialogRef.close();
        },
      });
  }
  handleFireError(err: string) {
    if (err === 'auth/email-already-in-use') {
      this.print_error('ADRESSE MAIL DEJA UTILISE');
      return;
    }
    if (err === 'auth/invalid-email') {
      this.print_error('INVALIDE ADRESSE MAIL');
      return;
    }
    if (err === 'auth/weak-password') {
      this.print_error('MOT DE PASSE FAIBLE');
    }
  }
  print_error(message: string) {
    this.snackbar.open(message, 'Dismiss', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
