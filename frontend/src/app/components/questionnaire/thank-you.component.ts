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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .thank-you-card {
      background: white;
      border-radius: 8px;
      padding: 60px 40px;
      max-width: 600px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30px auto;
      animation: scaleIn 0.5s ease-out;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }

    h1 {
      font-size: 28px;
      color: #333;
      margin: 0 0 20px 0;
    }

    .message {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }

    .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 32px;
    }

    .btn {
      padding: 12px 32px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;

      &:hover {
        background: #f8f9ff;
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
