import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/tokens';
import { User } from '../models/user.model'; 

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  login(loginData: { userId: string; password: string }): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(`${this.baseUrl}/login`, loginData);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  updateUsers(payload: { newUsers: User[]; updatedUsers: User[]; deletedUsers: User[] }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/users`, payload);
  }
}
