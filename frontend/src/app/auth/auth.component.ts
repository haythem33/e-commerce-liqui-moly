import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'firebase/auth';
import { AuthSelectors } from './services/auth.selectors';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass'],
})
export class AuthComponent implements OnInit {
  user!: User | null;
  constructor(private authService: AuthService, private store: Store<any>) {}

  ngOnInit(): void {
    this.get_user();
  }

  get_user(): void {
    this.store.select(AuthSelectors).subscribe({
      next: (user) => (this.user = user),
      error: (err) => console.error(err),
    });
  }
  openModel() {
    this.authService.open_auth_dialog();
  }
}
