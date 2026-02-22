import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  isLoginMode = true;
  showPassword = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  // ── Getters ─────────────────────────────────────────────────────────────────

  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }
  get registerName() { return this.registerForm.get('name'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerPassword() { return this.registerForm.get('password'); }
  get registerConfirmPassword() { return this.registerForm.get('confirmPassword'); }

  // ── Actions ─────────────────────────────────────────────────────────────────

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.successMessage = '';
    this.errorMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 401
          ? 'Invalid email or password.'
          : 'Login failed. Please try again.';
      },
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    const { name, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created! You are now logged in.';
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 409
          ? 'Email already registered.'
          : 'Registration failed. Please try again.';
      },
    });
  }
}
