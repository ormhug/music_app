import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/login';
  
  //хранит текущего пользователя
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    //при обновлении страницы пробуем восстановить вход из localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user from local storage', e);
      }
    }
  }

  //логин
  login(credentials: any): Observable<User> {
    return this.http.post<User>(this.apiUrl, credentials).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  //выход
  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  //получить текущего юзера мгновенно (не через подписку)
  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  //проверка роли (нужно для защиты роутов)
  hasRole(allowedRoles: string[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }
}