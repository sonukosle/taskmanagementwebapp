import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
loginData = {
    username: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  onLogin() {
    if (!this.loginData.username || !this.loginData.password) return;

    this.loading = true;
    this.errorMessage = '';

    // Temporary demo login
    setTimeout(() => {
      this.loading = false;

      if (
        this.loginData.username === 'sunny' &&
        this.loginData.password === '1234'
      ) {
        // redirect after login
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    }, 1000);
  }

}
