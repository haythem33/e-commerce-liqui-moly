import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-missing-information',
  templateUrl: './missing-information.component.html',
  styleUrls: ['./missing-information.component.sass'],
})
export class MissingInformationComponent implements OnInit, OnDestroy {
  phoneNumberRegex: RegExp = new RegExp(/^[1-9][0-9]{7}$/);
  streetRegex: RegExp = new RegExp(/^\s*\S+(?:\s+\S+){2}/);
  spinnerLoading: boolean = false;
  sub!: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  sendMissingInformation(ngForm: NgForm) {
    this.spinnerLoading = true;
    this.sub = this.authService
      .send_user_data({ ...this.user, ...ngForm.value })
      .subscribe({
        next: (res) => console.log(res),
        error: (err) =>
          this.authService.handleLoginError(JSON.parse(err.error), {
            ...this.user,
            ...ngForm.value,
          }),
      });
  }
}
