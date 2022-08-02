import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass'],
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit(): void {}
  openModel() {
    this.authService.open_auth_dialog();
  }
}
