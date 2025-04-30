import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light bg-gradient">
      <div class="card shadow-lg border-0 rounded-4" style="width: 450px;">
        <div class="card-header bg-primary text-white text-center py-4 border-0 rounded-top-4">
          <h3 class="mb-0 fw-bold">Order Management System</h3>
        </div>
        
        <div class="card-body p-5">
          <h4 class="card-title text-center mb-4 text-primary fw-bold">Welcome Back</h4>
          
          <!-- Alert messages -->
          <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
            <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
          </div>
          
          <!-- Login Form -->
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="mb-4">
              <label for="email" class="form-label fw-medium">Email address</label>
              <div class="input-group input-group-lg shadow-sm">
                <span class="input-group-text bg-white"><i class="bi bi-envelope text-primary"></i></span>
                <input 
                  type="email" 
                  class="form-control border-start-0" 
                  id="email" 
                  name="email"
                  [(ngModel)]="email"
                  required
                  email
                  #emailInput="ngModel"
                  placeholder="Enter your email"
                  autocomplete="email"
                >
              </div>
              <div 
                *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)" 
                class="text-danger small mt-2 ms-1"
              >
                <i class="bi bi-info-circle me-1"></i>
                <span *ngIf="emailInput.errors?.['required']">Email is required.</span>
                <span *ngIf="emailInput.errors?.['email']">Please enter a valid email address.</span>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <label for="password" class="form-label fw-medium">Password</label>
                <a href="#" class="text-decoration-none small text-primary">Forgot password?</a>
              </div>
              <div class="input-group input-group-lg shadow-sm">
                <span class="input-group-text bg-white"><i class="bi bi-lock text-primary"></i></span>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  class="form-control border-start-0 border-end-0" 
                  id="password" 
                  name="password"
                  [(ngModel)]="password"
                  required
                  minlength="6"
                  #passwordInput="ngModel"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                >
                <button 
                  type="button" 
                  class="input-group-text bg-white border-start-0" 
                  (click)="togglePasswordVisibility()"
                >
                  <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <div 
                *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" 
                class="text-danger small mt-2 ms-1"
              >
                <i class="bi bi-info-circle me-1"></i>
                <span *ngIf="passwordInput.errors?.['required']">Password is required.</span>
                <span *ngIf="passwordInput.errors?.['minlength']">Password must be at least 6 characters long.</span>
              </div>
            </div>
            
            <div class="form-check mb-4">
              <input class="form-check-input" type="checkbox" value="" id="rememberMe" [(ngModel)]="rememberMe" name="rememberMe">
              <label class="form-check-label" for="rememberMe">
                Remember me on this device
              </label>
            </div>
            
            <div class="d-grid gap-3 mt-4">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg fw-medium shadow-sm"
                [disabled]="loginForm.invalid || isLoading"
              >
                <i class="bi bi-box-arrow-in-right me-2"></i>
                <span *ngIf="!isLoading">Sign In</span>
                <span *ngIf="isLoading">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </span>
              </button>
              
              <div class="text-center">
                <span class="text-muted">Don't have an account?</span>
                <button 
                  type="button" 
                  class="btn btn-link text-decoration-none fw-medium"
                  routerLink="/register"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div class="card-footer text-center py-3 bg-light border-0 rounded-bottom-4">
          <small class="text-muted">© 2025 Order Management System</small>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Store remember me preference if selected
        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password. Please try again.';
        console.error('Login error:', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}