import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../model/task.model';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api/tasks';
    private authUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient, private auth: AuthService) {}

    // Login Endpoint
    login(username: string, password: string): Observable<any> {
      return this.http.post<any>(this.authUrl, { username, password });
    }

  // Get All Tasks
  getTasks(): Observable<Task[]> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Task[]>(this.baseUrl, { headers });
  }

  // Get Task By ID
  getTaskById(id: number): Observable<Task> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Task>(`${this.baseUrl}/${id}`, { headers });
  }

  // Create Task
  createTask(task: Task): Observable<Task> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Task>(this.baseUrl, task, { headers });
  }

  // Update Task
  updateTask(id: number, task: Task): Observable<Task> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task, { headers });
  }

  // Delete Task
  deleteTask(id: number): Observable<any> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}
