import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private dialogRef: MatDialogRef<MissingInformationComponent>
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  sendMissingInformation(ngForm: NgForm) {
    this.dialogRef.close({ ...this.user, ...ngForm.value });
  }
}
