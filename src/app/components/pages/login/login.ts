import { CommonModule } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onLogin() {
    debugger
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.form.value;

    this.auth.login(username as string, password as string).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(err instanceof Error ? err.message : 'Login failed');
      }
    });
  }
}
