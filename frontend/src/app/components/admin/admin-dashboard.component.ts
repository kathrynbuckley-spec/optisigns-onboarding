import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { QuestionnaireResponse } from '../../models/response.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  responses: any[] = [];
  filteredResponses: any[] = [];
  loading = true;
  errorMessage = '';
  searchTerm = '';
  filterIndustry = '';
  filterCompanySize = '';

  industries = ['retail', 'healthcare', 'education', 'hospitality', 'corporate', 'transportation', 'government', 'other'];
  companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.loading = true;
    this.apiService.getAllResponses().subscribe({
      next: (data) => {
        this.loading = false;
        if (data.success) {
          this.responses = data.responses;
          this.filteredResponses = [...this.responses];
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'Failed to load responses';
      }
    });
  }

  applyFilters(): void {
    this.filteredResponses = this.responses.filter(response => {
      const matchesSearch = !this.searchTerm ||
        response.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        response.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesIndustry = !this.filterIndustry || response.industry === this.filterIndustry;
      const matchesSize = !this.filterCompanySize || response.companySize === this.filterCompanySize;

      return matchesSearch && matchesIndustry && matchesSize;
    });
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onIndustryChange(event: any): void {
    this.filterIndustry = event.target.value;
    this.applyFilters();
  }

  onCompanySizeChange(event: any): void {
    this.filterCompanySize = event.target.value;
    this.applyFilters();
  }

  deleteResponse(id: string): void {
    if (confirm('Are you sure you want to delete this response?')) {
      this.apiService.deleteResponse(id).subscribe({
        next: (data) => {
          if (data.success) {
            this.loadResponses();
          }
        },
        error: (error) => {
          alert('Failed to delete response: ' + (error.error?.error || 'Unknown error'));
        }
      });
    }
  }

  exportToCSV(): void {
    if (this.filteredResponses.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = [
      'Company Name',
      'Email',
      'Company Size',
      'Industry',
      'Primary Use Case',
      'Number of Screens',
      'Screen Locations',
      'Technical Proficiency',
      'Current Platform',
      'Feature Interests',
      'Additional Comments',
      'Submitted At'
    ];

    const rows = this.filteredResponses.map(r => [
      r.companyName,
      r.email,
      r.companySize,
      r.industry,
      r.primaryUseCase,
      r.numberOfScreens,
      r.screenLocations || '',
      r.technicalProficiency,
      r.currentPlatform || '',
      (r.featureInterests || []).join('; '),
      r.additionalComments || '',
      new Date(r.submittedAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `questionnaire-responses-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
