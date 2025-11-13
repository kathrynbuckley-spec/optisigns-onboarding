import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { ThankYouComponent } from './components/questionnaire/thank-you.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'questionnaire', component: QuestionnaireComponent, canActivate: [authGuard] },
  { path: 'thank-you', component: ThankYouComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '/login' }
];
