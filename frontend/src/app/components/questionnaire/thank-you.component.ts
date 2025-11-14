import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="thank-you-container">
      <div class="thank-you-card">
        <div class="checkmark">✓</div>
        <h1>Thank you for completing the questionnaire!</h1>
        <p class="message">
          We've received your responses and will use them to personalize your OptiSigns experience.
        </p>
        <p class="message">
          Check your email for next steps to get started.
        </p>

        <div class="button-group">
          <button class="btn btn-secondary" (click)="logout()">Logout</button>
          <button class="btn btn-primary" *ngIf="isAdmin" routerLink="/admin">Go to Admin Dashboard</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .thank-you-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 20px;
    }

    .thank-you-card {
      background: white;
      border-radius: 16px;
      padding: 60px 40px;
      max-width: 600px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      border: 2px solid #e2e8f0;
    }

    .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #52C67A 0%, #45B368 100%);
      color: white;
      font-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30px auto;
      animation: scaleIn 0.5s ease-out;
      box-shadow: 0 4px 12px rgba(82, 198, 122, 0.3);
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 20px 0;
      line-height: 1.3;
    }

    .message {
      font-size: 16px;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }

    .button-group {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 32px;
    }

    .btn {
      padding: 14px 32px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      font-family: inherit;
    }

    .btn-primary {
      background: linear-gradient(135deg, #52C67A 0%, #45B368 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(82, 198, 122, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(82, 198, 122, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .btn-secondary {
      background: white;
      color: #64748b;
      border: 2px solid #e2e8f0;

      &:hover {
        background: #f8f9fa;
        border-color: #cbd5e0;
        color: #2d3748;
      }
    }
  `]
})
export class ThankYouComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
