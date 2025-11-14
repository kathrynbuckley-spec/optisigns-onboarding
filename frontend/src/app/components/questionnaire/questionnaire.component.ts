import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { QuestionnaireResponse } from '../../models/response.model';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  currentStep = 1;
  totalSteps = 7;
  questionnaireForm: FormGroup;
  loading = false;
  errorMessage = '';
  submitted = false;

  // Top countries for display
  topCountries: string[] = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany'
  ];

  // All countries for display
  allCountries: string[] = [
    'Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica',
    'Antigua And Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda',
    'Bhutan', 'Bolivia', 'Bosnia And Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil',
    'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad',
    'Chile', 'China', 'Christmas Island', 'Cocos (keeling) Islands', 'Colombia', 'Comoros', 'Congo',
    'Congo, The Democratic Republic Of The', 'Cook Islands', 'Costa Rica', 'Cote D\'ivoire', 'Croatia',
    'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
    'Falkland Islands (malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana',
    'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Ghana',
    'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea',
    'Guinea-bissau', 'Guyana', 'Haiti', 'Heard Island And Mcdonald Islands', 'Holy See (vatican City State)',
    'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Republic Of',
    'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakstan', 'Kenya', 'Kiribati',
    'Korea, Democratic People\'s Republic Of', 'Korea, Republic Of', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
    'Lao People\'s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia, The Former Yugoslav Republic Of',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique',
    'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States Of', 'Moldova, Republic Of',
    'Monaco', 'Mongolia', 'Montserrat', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
    'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua',
    'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestinian Territory, Occupied', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
    'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania',
    'Russian Federation', 'Rwanda', 'Saint Helena', 'Saint Kitts And Nevis', 'Saint Lucia',
    'Saint Pierre And Miquelon', 'Saint Vincent And The Grenadines', 'Samoa', 'San Marino',
    'Sao Tome And Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
    'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Georgia And The South Sandwich Islands', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
    'Svalbard And Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic',
    'Taiwan, Province Of China', 'Tajikistan', 'Tanzania, United Republic Of', 'Thailand', 'Togo',
    'Tokelau', 'Tonga', 'Trinidad And Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Turks And Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
    'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela',
    'Viet Nam', 'Virgin Islands, British', 'Virgin Islands, U.s.', 'Wallis And Futuna',
    'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // Country selection with grouping - flat array with group property
  countriesGrouped = [
    // Popular Countries
    { name: 'United States', group: 'Popular Countries' },
    { name: 'Canada', group: 'Popular Countries' },
    { name: 'United Kingdom', group: 'Popular Countries' },
    { name: 'Australia', group: 'Popular Countries' },
    { name: 'Germany', group: 'Popular Countries' },

    // All Countries
    { name: 'Afghanistan', group: 'All Countries' },
    { name: 'Albania', group: 'All Countries' },
    { name: 'Algeria', group: 'All Countries' },
    { name: 'American Samoa', group: 'All Countries' },
    { name: 'Andorra', group: 'All Countries' },
    { name: 'Angola', group: 'All Countries' },
    { name: 'Anguilla', group: 'All Countries' },
    { name: 'Antarctica', group: 'All Countries' },
    { name: 'Antigua And Barbuda', group: 'All Countries' },
    { name: 'Argentina', group: 'All Countries' },
    { name: 'Armenia', group: 'All Countries' },
    { name: 'Aruba', group: 'All Countries' },
    { name: 'Austria', group: 'All Countries' },
    { name: 'Azerbaijan', group: 'All Countries' },
    { name: 'Bahamas', group: 'All Countries' },
    { name: 'Bahrain', group: 'All Countries' },
    { name: 'Bangladesh', group: 'All Countries' },
    { name: 'Barbados', group: 'All Countries' },
    { name: 'Belarus', group: 'All Countries' },
    { name: 'Belgium', group: 'All Countries' },
    { name: 'Belize', group: 'All Countries' },
    { name: 'Benin', group: 'All Countries' },
    { name: 'Bermuda', group: 'All Countries' },
    { name: 'Bhutan', group: 'All Countries' },
    { name: 'Bolivia', group: 'All Countries' },
    { name: 'Bosnia And Herzegovina', group: 'All Countries' },
    { name: 'Botswana', group: 'All Countries' },
    { name: 'Bouvet Island', group: 'All Countries' },
    { name: 'Brazil', group: 'All Countries' },
    { name: 'British Indian Ocean Territory', group: 'All Countries' },
    { name: 'Brunei Darussalam', group: 'All Countries' },
    { name: 'Bulgaria', group: 'All Countries' },
    { name: 'Burkina Faso', group: 'All Countries' },
    { name: 'Burundi', group: 'All Countries' },
    { name: 'Cambodia', group: 'All Countries' },
    { name: 'Cameroon', group: 'All Countries' },
    { name: 'Cape Verde', group: 'All Countries' },
    { name: 'Cayman Islands', group: 'All Countries' },
    { name: 'Central African Republic', group: 'All Countries' },
    { name: 'Chad', group: 'All Countries' },
    { name: 'Chile', group: 'All Countries' },
    { name: 'China', group: 'All Countries' },
    { name: 'Christmas Island', group: 'All Countries' },
    { name: 'Cocos (keeling) Islands', group: 'All Countries' },
    { name: 'Colombia', group: 'All Countries' },
    { name: 'Comoros', group: 'All Countries' },
    { name: 'Congo', group: 'All Countries' },
    { name: 'Congo, The Democratic Republic Of The', group: 'All Countries' },
    { name: 'Cook Islands', group: 'All Countries' },
    { name: 'Costa Rica', group: 'All Countries' },
    { name: 'Cote D\'ivoire', group: 'All Countries' },
    { name: 'Croatia', group: 'All Countries' },
    { name: 'Cuba', group: 'All Countries' },
    { name: 'Cyprus', group: 'All Countries' },
    { name: 'Czech Republic', group: 'All Countries' },
    { name: 'Denmark', group: 'All Countries' },
    { name: 'Djibouti', group: 'All Countries' },
    { name: 'Dominica', group: 'All Countries' },
    { name: 'Dominican Republic', group: 'All Countries' },
    { name: 'East Timor', group: 'All Countries' },
    { name: 'Ecuador', group: 'All Countries' },
    { name: 'Egypt', group: 'All Countries' },
    { name: 'El Salvador', group: 'All Countries' },
    { name: 'Equatorial Guinea', group: 'All Countries' },
    { name: 'Eritrea', group: 'All Countries' },
    { name: 'Estonia', group: 'All Countries' },
    { name: 'Ethiopia', group: 'All Countries' },
    { name: 'Falkland Islands (malvinas)', group: 'All Countries' },
    { name: 'Faroe Islands', group: 'All Countries' },
    { name: 'Fiji', group: 'All Countries' },
    { name: 'Finland', group: 'All Countries' },
    { name: 'France', group: 'All Countries' },
    { name: 'French Guiana', group: 'All Countries' },
    { name: 'French Polynesia', group: 'All Countries' },
    { name: 'French Southern Territories', group: 'All Countries' },
    { name: 'Gabon', group: 'All Countries' },
    { name: 'Gambia', group: 'All Countries' },
    { name: 'Georgia', group: 'All Countries' },
    { name: 'Ghana', group: 'All Countries' },
    { name: 'Gibraltar', group: 'All Countries' },
    { name: 'Greece', group: 'All Countries' },
    { name: 'Greenland', group: 'All Countries' },
    { name: 'Grenada', group: 'All Countries' },
    { name: 'Guadeloupe', group: 'All Countries' },
    { name: 'Guam', group: 'All Countries' },
    { name: 'Guatemala', group: 'All Countries' },
    { name: 'Guinea', group: 'All Countries' },
    { name: 'Guinea-bissau', group: 'All Countries' },
    { name: 'Guyana', group: 'All Countries' },
    { name: 'Haiti', group: 'All Countries' },
    { name: 'Heard Island And Mcdonald Islands', group: 'All Countries' },
    { name: 'Holy See (vatican City State)', group: 'All Countries' },
    { name: 'Honduras', group: 'All Countries' },
    { name: 'Hong Kong', group: 'All Countries' },
    { name: 'Hungary', group: 'All Countries' },
    { name: 'Iceland', group: 'All Countries' },
    { name: 'India', group: 'All Countries' },
    { name: 'Indonesia', group: 'All Countries' },
    { name: 'Iran, Islamic Republic Of', group: 'All Countries' },
    { name: 'Iraq', group: 'All Countries' },
    { name: 'Ireland', group: 'All Countries' },
    { name: 'Israel', group: 'All Countries' },
    { name: 'Italy', group: 'All Countries' },
    { name: 'Jamaica', group: 'All Countries' },
    { name: 'Japan', group: 'All Countries' },
    { name: 'Jordan', group: 'All Countries' },
    { name: 'Kazakstan', group: 'All Countries' },
    { name: 'Kenya', group: 'All Countries' },
    { name: 'Kiribati', group: 'All Countries' },
    { name: 'Korea, Democratic People\'s Republic Of', group: 'All Countries' },
    { name: 'Korea, Republic Of', group: 'All Countries' },
    { name: 'Kosovo', group: 'All Countries' },
    { name: 'Kuwait', group: 'All Countries' },
    { name: 'Kyrgyzstan', group: 'All Countries' },
    { name: 'Lao People\'s Democratic Republic', group: 'All Countries' },
    { name: 'Latvia', group: 'All Countries' },
    { name: 'Lebanon', group: 'All Countries' },
    { name: 'Lesotho', group: 'All Countries' },
    { name: 'Liberia', group: 'All Countries' },
    { name: 'Libyan Arab Jamahiriya', group: 'All Countries' },
    { name: 'Liechtenstein', group: 'All Countries' },
    { name: 'Lithuania', group: 'All Countries' },
    { name: 'Luxembourg', group: 'All Countries' },
    { name: 'Macau', group: 'All Countries' },
    { name: 'Macedonia, The Former Yugoslav Republic Of', group: 'All Countries' },
    { name: 'Madagascar', group: 'All Countries' },
    { name: 'Malawi', group: 'All Countries' },
    { name: 'Malaysia', group: 'All Countries' },
    { name: 'Maldives', group: 'All Countries' },
    { name: 'Mali', group: 'All Countries' },
    { name: 'Malta', group: 'All Countries' },
    { name: 'Marshall Islands', group: 'All Countries' },
    { name: 'Martinique', group: 'All Countries' },
    { name: 'Mauritania', group: 'All Countries' },
    { name: 'Mauritius', group: 'All Countries' },
    { name: 'Mayotte', group: 'All Countries' },
    { name: 'Mexico', group: 'All Countries' },
    { name: 'Micronesia, Federated States Of', group: 'All Countries' },
    { name: 'Moldova, Republic Of', group: 'All Countries' },
    { name: 'Monaco', group: 'All Countries' },
    { name: 'Mongolia', group: 'All Countries' },
    { name: 'Montserrat', group: 'All Countries' },
    { name: 'Montenegro', group: 'All Countries' },
    { name: 'Morocco', group: 'All Countries' },
    { name: 'Mozambique', group: 'All Countries' },
    { name: 'Myanmar', group: 'All Countries' },
    { name: 'Namibia', group: 'All Countries' },
    { name: 'Nauru', group: 'All Countries' },
    { name: 'Nepal', group: 'All Countries' },
    { name: 'Netherlands', group: 'All Countries' },
    { name: 'Netherlands Antilles', group: 'All Countries' },
    { name: 'New Caledonia', group: 'All Countries' },
    { name: 'New Zealand', group: 'All Countries' },
    { name: 'Nicaragua', group: 'All Countries' },
    { name: 'Niger', group: 'All Countries' },
    { name: 'Nigeria', group: 'All Countries' },
    { name: 'Niue', group: 'All Countries' },
    { name: 'Norfolk Island', group: 'All Countries' },
    { name: 'Northern Mariana Islands', group: 'All Countries' },
    { name: 'Norway', group: 'All Countries' },
    { name: 'Oman', group: 'All Countries' },
    { name: 'Pakistan', group: 'All Countries' },
    { name: 'Palau', group: 'All Countries' },
    { name: 'Palestinian Territory, Occupied', group: 'All Countries' },
    { name: 'Panama', group: 'All Countries' },
    { name: 'Papua New Guinea', group: 'All Countries' },
    { name: 'Paraguay', group: 'All Countries' },
    { name: 'Peru', group: 'All Countries' },
    { name: 'Philippines', group: 'All Countries' },
    { name: 'Pitcairn', group: 'All Countries' },
    { name: 'Poland', group: 'All Countries' },
    { name: 'Portugal', group: 'All Countries' },
    { name: 'Puerto Rico', group: 'All Countries' },
    { name: 'Qatar', group: 'All Countries' },
    { name: 'Reunion', group: 'All Countries' },
    { name: 'Romania', group: 'All Countries' },
    { name: 'Russian Federation', group: 'All Countries' },
    { name: 'Rwanda', group: 'All Countries' },
    { name: 'Saint Helena', group: 'All Countries' },
    { name: 'Saint Kitts And Nevis', group: 'All Countries' },
    { name: 'Saint Lucia', group: 'All Countries' },
    { name: 'Saint Pierre And Miquelon', group: 'All Countries' },
    { name: 'Saint Vincent And The Grenadines', group: 'All Countries' },
    { name: 'Samoa', group: 'All Countries' },
    { name: 'San Marino', group: 'All Countries' },
    { name: 'Sao Tome And Principe', group: 'All Countries' },
    { name: 'Saudi Arabia', group: 'All Countries' },
    { name: 'Senegal', group: 'All Countries' },
    { name: 'Serbia', group: 'All Countries' },
    { name: 'Seychelles', group: 'All Countries' },
    { name: 'Sierra Leone', group: 'All Countries' },
    { name: 'Singapore', group: 'All Countries' },
    { name: 'Slovakia', group: 'All Countries' },
    { name: 'Slovenia', group: 'All Countries' },
    { name: 'Solomon Islands', group: 'All Countries' },
    { name: 'Somalia', group: 'All Countries' },
    { name: 'South Africa', group: 'All Countries' },
    { name: 'South Georgia And The South Sandwich Islands', group: 'All Countries' },
    { name: 'Spain', group: 'All Countries' },
    { name: 'Sri Lanka', group: 'All Countries' },
    { name: 'Sudan', group: 'All Countries' },
    { name: 'Suriname', group: 'All Countries' },
    { name: 'Svalbard And Jan Mayen', group: 'All Countries' },
    { name: 'Swaziland', group: 'All Countries' },
    { name: 'Sweden', group: 'All Countries' },
    { name: 'Switzerland', group: 'All Countries' },
    { name: 'Syrian Arab Republic', group: 'All Countries' },
    { name: 'Taiwan, Province Of China', group: 'All Countries' },
    { name: 'Tajikistan', group: 'All Countries' },
    { name: 'Tanzania, United Republic Of', group: 'All Countries' },
    { name: 'Thailand', group: 'All Countries' },
    { name: 'Togo', group: 'All Countries' },
    { name: 'Tokelau', group: 'All Countries' },
    { name: 'Tonga', group: 'All Countries' },
    { name: 'Trinidad And Tobago', group: 'All Countries' },
    { name: 'Tunisia', group: 'All Countries' },
    { name: 'Turkey', group: 'All Countries' },
    { name: 'Turkmenistan', group: 'All Countries' },
    { name: 'Turks And Caicos Islands', group: 'All Countries' },
    { name: 'Tuvalu', group: 'All Countries' },
    { name: 'Uganda', group: 'All Countries' },
    { name: 'Ukraine', group: 'All Countries' },
    { name: 'United Arab Emirates', group: 'All Countries' },
    { name: 'United States Minor Outlying Islands', group: 'All Countries' },
    { name: 'Uruguay', group: 'All Countries' },
    { name: 'Uzbekistan', group: 'All Countries' },
    { name: 'Vanuatu', group: 'All Countries' },
    { name: 'Venezuela', group: 'All Countries' },
    { name: 'Viet Nam', group: 'All Countries' },
    { name: 'Virgin Islands, British', group: 'All Countries' },
    { name: 'Virgin Islands, U.s.', group: 'All Countries' },
    { name: 'Wallis And Futuna', group: 'All Countries' },
    { name: 'Western Sahara', group: 'All Countries' },
    { name: 'Yemen', group: 'All Countries' },
    { name: 'Zambia', group: 'All Countries' },
    { name: 'Zimbabwe', group: 'All Countries' }
  ];

  // Company sizes
  companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  // Industries
  industries = [
    { value: 'retail', label: 'Retail', icon: '🏪' },
    { value: 'corporate', label: 'Corporate', icon: '🏢' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'healthcare', label: 'Healthcare', icon: '❤️' },
    { value: 'hospitality', label: 'Hospitality', icon: '🍴' },
    { value: 'professional-services', label: 'Professional Services', icon: '💼' },
    { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
    { value: 'technology', label: 'Technology', icon: '💻' }
  ];

  // Screen counts
  screenCounts = [
    { value: '1-5', label: '1-5 screens', description: 'Small deployment', icon: '📺' },
    { value: '6-20', label: '6-20 screens', description: 'Medium deployment', icon: '📺' },
    { value: '21-50', label: '21-50 screens', description: 'Large deployment', icon: '📺' },
    { value: '51-100', label: '51-100 screens', description: 'Enterprise scale', icon: '📺' },
    { value: '100+', label: '100+ screens', description: 'Enterprise scale+', icon: '📺' }
  ];

  // Use cases
  useCases = [
    { value: 'menu-boards', label: 'Menu Boards', icon: '📋' },
    { value: 'wayfinding', label: 'Wayfinding & Directories', icon: '🗺️' },
    { value: 'corporate-comms', label: 'Corporate Communications', icon: '💼' },
    { value: 'advertising', label: 'Advertising & Promotions', icon: '📢' },
    { value: 'information-display', label: 'Information Display', icon: 'ℹ️' },
    { value: 'event-signage', label: 'Event Signage', icon: '🎉' },
    { value: 'other', label: 'Other', icon: '✏️' }
  ];

  // Technical proficiency levels
  proficiencyLevels = [
    { value: 'beginner', label: 'Beginner', description: 'I\'m new to digital signage', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate', description: 'I have some experience with similar tools', icon: '🌿' },
    { value: 'advanced', label: 'Advanced', description: 'I\'m very comfortable with technology', icon: '🌳' }
  ];

  // Features
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
      // Step 1: Country + Company Name + Company Size
      accountCountry: ['', Validators.required],
      companyName: ['', Validators.required],
      companySize: ['', Validators.required],

      // Step 2: Industry
      industry: ['', Validators.required],

      // Step 3: Screen Count
      numberOfScreens: ['', Validators.required],

      // Step 4: Primary Use Case
      primaryUseCase: ['', Validators.required],
      useCaseDescription: [''],

      // Step 5: Technical Proficiency + Current Platform
      technicalProficiency: ['', Validators.required],
      currentPlatform: ['', Validators.maxLength(200)],

      // Step 6: Feature Interests
      featureInterests: [[]],

      // Step 7: Summary + Additional Comments
      additionalComments: ['', Validators.maxLength(500)],

      // Optional fields
      screenLocations: ['']
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
        return ['accountCountry', 'companyName', 'companySize'];
      case 2:
        return ['industry'];
      case 3:
        return ['numberOfScreens'];
      case 4:
        return ['primaryUseCase'];
      case 5:
        return ['technicalProficiency'];
      case 6:
        return []; // Feature interests are optional
      case 7:
        return []; // Summary page, no validation needed
      default:
        return [];
    }
  }

  // Helper to get summary data for step 7
  getSummaryData() {
    const formValue = this.questionnaireForm.value;
    const industryObj = this.industries.find(i => i.value === formValue.industry);
    const screenCountObj = this.screenCounts.find(s => s.value === formValue.numberOfScreens);
    const useCaseObj = this.useCases.find(u => u.value === formValue.primaryUseCase);
    const proficiencyObj = this.proficiencyLevels.find(p => p.value === formValue.technicalProficiency);

    return {
      companyName: formValue.companyName || '',
      country: formValue.accountCountry || '',
      companySize: formValue.companySize || '',
      industry: industryObj?.label || '',
      screenCount: screenCountObj?.label || '',
      primaryUseCase: useCaseObj?.label || '',
      technicalProficiency: proficiencyObj?.label || '',
      currentPlatform: formValue.currentPlatform || 'None',
      featureInterests: formValue.featureInterests || []
    };
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
