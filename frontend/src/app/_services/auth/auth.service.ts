import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from '../../_entities/users/user.model';
import {DYNAMIC_ENVIRONMENT, DynamicEnvironment} from '../../../environments/dynamic-environment';
import {ApiService} from '../api.service';
import {ToastService} from '../toast.service';
import {jwtDecode, JwtPayload} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = this.environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    @Inject(DYNAMIC_ENVIRONMENT) private environment: DynamicEnvironment,
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    if (!this.isLoggedIn()) {
      this.currentUserSubject.next(null);
      return;
    }
    this.getCurrentUser().subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null),
    });
  }

  public login(email: string, password: string): Observable<void> {
    return this.http.post<any>(`${this.apiUrl}users/login`, { email, password }).pipe(
      tap(response => localStorage.setItem('userToken', response.access_token)),
      tap(() => this.loadCurrentUser()),
      map(() => void 0)
    );
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}users/current-user`);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('userToken');
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp > currentTime) {
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch {
      this.logout();
      return false;
    }
  }

  logout() {
    localStorage.removeItem('userToken');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login').then();
    this.toastService.presentToast('Vous êtes déconnecté(e)');
  }

  public getUserRole(): string {
    const token = localStorage.getItem('userToken');
    if (!token) return '';
    const decoded: any = jwtDecode(token);
    return decoded.role;
  }
}
