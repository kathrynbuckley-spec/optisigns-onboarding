import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Login to OptiSigns</h1>
        <p class="subtitle">Sign in to access the onboarding questionnaire</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="your@email.com"
            />
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Enter your password"
            />
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">Login</span>
            <span *ngIf="loading">Logging in...</span>
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account?
          <a routerLink="/register">Register here</a>
        </p>

        <div class="demo-credentials">
          <strong>Demo Credentials:</strong><br>
          User: user&#64;acmecoffee.com / password123<br>
          Admin: admin&#64;optisigns.com / admin123
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gradient-primary);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .auth-container::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 15s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(180deg); }
    }

    .auth-card {
      background: var(--white);
      border-radius: var(--radius-lg);
      padding: 48px 40px;
      max-width: 440px;
      width: 100%;
      box-shadow: var(--shadow-xl);
      position: relative;
      z-index: 1;
      animation: slideIn 0.4s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 700;
      color: var(--gray-900);
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      margin: 0 0 32px 0;
      color: var(--gray-600);
      font-size: 15px;
      line-height: 1.5;
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--gray-700);
      font-size: 14px;
      letter-spacing: 0.01em;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius);
      font-size: 15px;
      transition: all var(--transition);
      box-sizing: border-box;
      background: var(--white);
    }

    .form-control:hover {
      border-color: var(--gray-300);
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }

    .form-control.error {
      border-color: var(--error);
      background: #fef2f2;
    }

    .error-message {
      color: var(--error);
      font-size: 13px;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }

    .error-message::before {
      content: '⚠';
      font-size: 14px;
    }

    .btn {
      width: 100%;
      padding: 14px 24px;
      border: none;
      border-radius: var(--radius);
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition);
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: var(--white);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .btn-primary:hover:not(:disabled)::before {
      left: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--gray-200);
      font-size: 14px;
      color: var(--gray-600);
    }

    .auth-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      transition: color var(--transition);
    }

    .auth-footer a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .demo-credentials {
      margin-top: 24px;
      padding: 16px;
      background: var(--gradient-light);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius);
      font-size: 12px;
      color: var(--gray-700);
      line-height: 1.8;
    }

    .demo-credentials strong {
      color: var(--gray-900);
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl: string = '/questionnaire';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/questionnaire'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/questionnaire';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            // Navigate to return URL or questionnaire
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.error || 'Login failed. Please try again.';
        }
      });
    }
  }
}
