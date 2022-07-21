import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'frontend';
  constructor(private authService: AuthService) {}
  openModel() {
    this.authService.open_auth_dialog();
  }
}
