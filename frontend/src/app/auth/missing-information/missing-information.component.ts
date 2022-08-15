import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase/auth';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-missing-information',
  templateUrl: './missing-information.component.html',
  styleUrls: ['./missing-information.component.sass'],
})
export class MissingInformationComponent implements OnInit, OnDestroy {
  phoneNumberRegex: RegExp = new RegExp(/^[1-9][0-9]{7}$/);
  streetRegex: RegExp = new RegExp(/^\s*\S+(?:\s+\S+){2}/);
  private readonly destroyed$ = new Subject();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public config: { type: 'LOGIN' | 'REGISTER'; user: User },
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<MissingInformationComponent>
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  sendMissingInformation(user: NgForm) {
    let complete_user = {
      ...user.value,
      ...this.config.user,
      phoneNumber: user.value.phoneNumber,
    };
    if (this.config.type === 'LOGIN') {
      this.send_to_login(complete_user);
      return;
    }
    if (this.config.type === 'REGISTER') {
      this.send_to_register(complete_user);
    }
  }
  send_to_register(user: any): void {
    this.auth
      .send_user_register(user)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => console.log('completed'),
        error: (err) => console.error(err),
      });
  }

  send_to_login(user: User): void {
    this.auth
      .send_user_login(user)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => console.log('completed'),
        error: (err) => console.error(err),
      });
  }

  print_error(message: string) {
    this.snackbar.open(message, 'Dismiss', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
