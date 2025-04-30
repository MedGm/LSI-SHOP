import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light bg-gradient">
      <div class="card shadow-lg border-0 rounded-4" style="width: 450px;">
        <div class="card-header bg-primary text-white text-center py-4 border-0 rounded-top-4">
          <h3 class="mb-0 fw-bold">Order Management System</h3>
        </div>
        
        <div class="card-body p-5">
          <h4 class="card-title text-center mb-4 text-primary fw-bold">Create Account</h4>
          
          <!-- Alert messages -->
          <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
            <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
          </div>
          
          <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
            <button type="button" class="btn-close" (click)="successMessage = ''"></button>
          </div>
          
          <!-- Registration Form -->
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="mb-4">
              <label for="name" class="form-label fw-medium">Full Name</label>
              <div class="input-group input-group-lg shadow-sm">
                <span class="input-group-text bg-white"><i class="bi bi-person text-primary"></i></span>
                <input 
                  type="text" 
                  class="form-control border-start-0" 
                  id="name" 
                  name="name"
                  [(ngModel)]="name"
                  required
                  minlength="3"
                  #nameInput="ngModel"
                  placeholder="Enter your full name"
                  autocomplete="name"
                >
              </div>
              <div 
                *ngIf="nameInput.invalid && (nameInput.dirty || nameInput.touched)" 
                class="text-danger small mt-2 ms-1"
              >
                <i class="bi bi-info-circle me-1"></i>
                <span *ngIf="nameInput.errors?.['required']">Name is required.</span>
                <span *ngIf="nameInput.errors?.['minlength']">Name must be at least 3 characters long.</span>
              </div>
            </div>
            
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
              <label for="password" class="form-label fw-medium">Password</label>
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
                  placeholder="Create a password"
                  autocomplete="new-password"
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
              <div class="password-strength mt-2 small" *ngIf="password">
                <div class="progress" style="height: 5px;">
                  <div class="progress-bar" [ngClass]="getPasswordStrengthClass()" [style.width.%]="getPasswordStrength()"></div>
                </div>
                <div class="mt-1 text-muted">
                  Password strength: <span [ngClass]="getPasswordStrengthTextClass()">{{getPasswordStrengthText()}}</span>
                </div>
              </div>
            </div>
            
            <div class="form-check mb-4">
              <input class="form-check-input" type="checkbox" value="" id="termsCheck" [(ngModel)]="acceptTerms" name="acceptTerms" required #termsInput="ngModel">
              <label class="form-check-label" for="termsCheck">
                I agree to the <a href="#" class="text-decoration-none">Terms of Service</a> and <a href="#" class="text-decoration-none">Privacy Policy</a>
              </label>
              <div 
                *ngIf="termsInput.invalid && (termsInput.dirty || termsInput.touched)" 
                class="text-danger small mt-1"
              >
                <i class="bi bi-info-circle me-1"></i>You must agree to the terms to continue.
              </div>
            </div>
            
            <div class="d-grid gap-3 mt-4">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg fw-medium shadow-sm"
                [disabled]="registerForm.invalid || isRegistering"
              >
                <i class="bi bi-person-plus me-2"></i>
                <span *ngIf="!isRegistering">Create Account</span>
                <span *ngIf="isRegistering">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating account...
                </span>
              </button>
              
              <div class="text-center">
                <span class="text-muted">Already have an account?</span>
                <button 
                  type="button" 
                  class="btn btn-link text-decoration-none fw-medium"
                  routerLink="/login"
                >
                  Sign In
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
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isRegistering: boolean = false;
  showPassword: boolean = false;
  acceptTerms: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password || !this.acceptTerms) {
      this.errorMessage = 'Please fill in all fields and accept the terms.';
      return;
    }

    this.isRegistering = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (response) => {
        this.isRegistering = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isRegistering = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): number {
    if (!this.password) return 0;
    
    let strength = 0;
    
    // Length contribution
    if (this.password.length >= 6) strength += 20;
    if (this.password.length >= 8) strength += 10;
    if (this.password.length >= 10) strength += 10;
    
    // Complexity contribution
    if (/[A-Z]/.test(this.password)) strength += 15; // Uppercase
    if (/[a-z]/.test(this.password)) strength += 15; // Lowercase
    if (/[0-9]/.test(this.password)) strength += 15; // Numbers
    if (/[^A-Za-z0-9]/.test(this.password)) strength += 15; // Special characters
    
    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'bg-danger';
    if (strength < 70) return 'bg-warning';
    return 'bg-success';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'text-danger';
    if (strength < 70) return 'text-warning';
    return 'text-success';
  }
}