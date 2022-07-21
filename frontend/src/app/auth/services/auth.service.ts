import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthComponent } from '../auth.component';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public dialog: MatDialog) {}

  public open_auth_dialog(data?: any): MatDialogRef<AuthComponent> {
    return this.dialog.open(AuthComponent, {
      width: '500px',
      data: { ...data },
    });
  }
}
