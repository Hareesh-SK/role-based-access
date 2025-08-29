import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/tokens';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  login(loginData: { userId: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  getAllUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/users`); 
  }

  updateUsers(payload: { newUsers: any[]; updatedUsers: any[] }) {
    return this.http.post<any>(`${this.baseUrl}/users`, payload);
  }

}
