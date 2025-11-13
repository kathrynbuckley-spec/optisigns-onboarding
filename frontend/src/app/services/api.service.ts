import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuestionnaireResponse, ResponseSubmitResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Questionnaire endpoints
  submitResponse(response: QuestionnaireResponse): Observable<ResponseSubmitResponse> {
    return this.http.post<ResponseSubmitResponse>(`${this.apiUrl}/responses`, response);
  }

  getMyResponse(): Observable<{ success: boolean; response: QuestionnaireResponse }> {
    return this.http.get<{ success: boolean; response: QuestionnaireResponse }>(`${this.apiUrl}/responses/me`);
  }

  // Admin endpoints
  getAllResponses(): Observable<{ success: boolean; count: number; responses: QuestionnaireResponse[] }> {
    return this.http.get<{ success: boolean; count: number; responses: QuestionnaireResponse[] }>(`${this.apiUrl}/admin/responses`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`);
  }

  deleteResponse(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/admin/responses/${id}`);
  }
}
