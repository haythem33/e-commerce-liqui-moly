import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase/auth';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit, OnDestroy {
  hide: boolean = true;
  allSub: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.allSub.map((sub) => sub.unsubscribe());
  }
  public async google_login(): Promise<void> {
    const obj = await this.authService.goole_login();
    if (!obj) {
      return;
    }
    let { userCredential, observable } = obj;
    (observable as Observable<any>).subscribe({
      next: (res) => console.log(res),
      error: (err) =>
        this.authService.handleLoginError(
          JSON.parse(err.error),
          userCredential
        ),
    });
  }
  public async facebook_login(): Promise<void> {}
}
