import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../model/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api/tasks';
    private authUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {}

    // Login Endpoint
    login(username: string, password: string): Observable<any> {
      return this.http.post<any>(this.authUrl, { username, password });
    }

  // Get All Tasks
  getTasks(token: string): Observable<Task[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Task[]>(this.baseUrl, { headers });
  }

  // Get Task By ID
  getTaskById(id: number, token: string): Observable<Task> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Task>(`${this.baseUrl}/${id}`, { headers });
  }

  // Create Task
  createTask(task: Task, token: string): Observable<Task> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Task>(this.baseUrl, task, { headers });
  }

  // Update Task
  updateTask(id: number, task: Task, token: string): Observable<Task> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task, { headers });
  }

  // Delete Task
  deleteTask(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}
