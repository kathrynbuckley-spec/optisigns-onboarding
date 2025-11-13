export interface QuestionnaireResponse {
  _id?: string;
  userId?: string;
  email?: string;

  // Step 1: Company Information
  companyName: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  industry: 'retail' | 'healthcare' | 'education' | 'hospitality' | 'corporate' | 'transportation' | 'government' | 'other';

  // Step 2: Primary Use Case
  primaryUseCase: 'menu-boards' | 'wayfinding' | 'corporate-comms' | 'advertising' | 'information-display' | 'event-signage' | 'other';
  useCaseDescription?: string;

  // Step 3: Screen Setup
  numberOfScreens: '1-5' | '6-20' | '21-50' | '51-100' | '100+';
  screenLocations?: string;

  // Step 4: Technical Profile
  technicalProficiency: 'beginner' | 'intermediate' | 'advanced';
  currentPlatform?: string;

  // Step 5: Feature Interests
  featureInterests: string[];
  additionalComments?: string;

  // Metadata
  submittedAt?: Date;
  ipAddress?: string;
  referralSource?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

export interface ResponseSubmitResponse {
  success: boolean;
  responseId: string;
  message: string;
}
