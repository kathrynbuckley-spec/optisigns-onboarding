import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { QuestionnaireResponse } from '../../models/response.model';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  currentStep = 1;
  totalSteps = 5;
  questionnaireForm: FormGroup;
  loading = false;
  errorMessage = '';
  submitted = false;

  companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  industries = [
    { value: 'retail', label: 'Retail' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'corporate', label: 'Corporate/Office' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'government', label: 'Government' },
    { value: 'other', label: 'Other' }
  ];

  useCases = [
    { value: 'menu-boards', label: 'Menu Boards', icon: '📋' },
    { value: 'wayfinding', label: 'Wayfinding & Directories', icon: '🗺️' },
    { value: 'corporate-comms', label: 'Corporate Communications', icon: '💼' },
    { value: 'advertising', label: 'Advertising & Promotions', icon: '📢' },
    { value: 'information-display', label: 'Information Display', icon: 'ℹ️' },
    { value: 'event-signage', label: 'Event Signage', icon: '🎉' },
    { value: 'other', label: 'Other', icon: '✏️' }
  ];

  screenCounts = ['1-5', '6-20', '21-50', '51-100', '100+'];

  proficiencyLevels = [
    { value: 'beginner', label: 'Beginner', description: 'I\'m new to digital signage', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate', description: 'I have some experience with similar tools', icon: '🌿' },
    { value: 'advanced', label: 'Advanced', description: 'I\'m very comfortable with technology', icon: '🌳' }
  ];

  features = [
    { value: 'scheduling', label: 'Content Scheduling', icon: '⏰' },
    { value: 'multi-zone', label: 'Multi-Zone Layouts', icon: '🖼️' },
    { value: 'data-integration', label: 'Data Integration (RSS, APIs, etc.)', icon: '🔗' },
    { value: 'mobile-app', label: 'Mobile App Management', icon: '📱' },
    { value: 'analytics', label: 'Analytics & Reporting', icon: '📊' },
    { value: 'collaboration', label: 'Team Collaboration', icon: '👥' },
    { value: 'emergency-alerts', label: 'Emergency Alerts', icon: '🚨' },
    { value: 'social-feeds', label: 'Social Media Feeds', icon: '📲' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.questionnaireForm = this.fb.group({
      // Step 1
      companyName: ['', Validators.required],
      companySize: ['', Validators.required],
      industry: ['', Validators.required],

      // Step 2
      primaryUseCase: ['', Validators.required],
      useCaseDescription: [''],

      // Step 3
      numberOfScreens: ['', Validators.required],
      screenLocations: [''],

      // Step 4
      technicalProficiency: ['', Validators.required],
      currentPlatform: [''],

      // Step 5
      featureInterests: [[]],
      additionalComments: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    // Check if user already completed questionnaire
    this.apiService.getMyResponse().subscribe({
      next: (response) => {
        if (response.success) {
          // User already completed, redirect to thank you page
          this.router.navigate(['/thank-you']);
        }
      },
      error: () => {
        // No response found, continue with questionnaire
      }
    });
  }

  nextStep(): void {
    if (this.isStepValid()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(): boolean {
    const currentStepControls = this.getStepControls();
    return currentStepControls.every(control => this.questionnaireForm.get(control)?.valid);
  }

  getStepControls(): string[] {
    switch (this.currentStep) {
      case 1:
        return ['companyName', 'companySize', 'industry'];
      case 2:
        return ['primaryUseCase'];
      case 3:
        return ['numberOfScreens'];
      case 4:
        return ['technicalProficiency'];
      case 5:
        return [];
      default:
        return [];
    }
  }

  toggleFeature(feature: string): void {
    const currentFeatures = this.questionnaireForm.get('featureInterests')?.value || [];
    const index = currentFeatures.indexOf(feature);

    if (index > -1) {
      currentFeatures.splice(index, 1);
    } else {
      currentFeatures.push(feature);
    }

    this.questionnaireForm.patchValue({ featureInterests: currentFeatures });
  }

  isFeatureSelected(feature: string): boolean {
    const features = this.questionnaireForm.get('featureInterests')?.value || [];
    return features.includes(feature);
  }

  onSubmit(): void {
    if (this.questionnaireForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData: QuestionnaireResponse = this.questionnaireForm.value;

      this.apiService.submitResponse(formData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.submitted = true;
            this.router.navigate(['/thank-you']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.error || 'Failed to submit questionnaire. Please try again.';
        }
      });
    }
  }

  get progress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
