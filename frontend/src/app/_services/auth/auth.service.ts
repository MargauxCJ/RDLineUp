import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {TokenService} from './token.service';
import {MemberService} from '../api/member.service';
import {Router} from '@angular/router';
import {ToastService} from '../toast.service';
import {User} from '../../_entities/users/user.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private tokenService: TokenService,
    private userService: MemberService,  // ou UserService, qui étend CrudService<User>
    private router: Router,
    private toastService: ToastService,
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    if (!this.tokenService.isTokenValid()) {
      this.currentUserSubject.next(null);
      return;
    }
    this.userService.getCurrentUser().subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null),
    });
  }

  login(email: string, password: string): Observable<void> {
    return this.userService.login(email, password).pipe(
      tap(token => this.tokenService.setToken(token)),
      tap(() => this.loadCurrentUser()),
      map(() => void 0)
    );
  }

  logout() {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login').then();
    this.toastService.presentToast('Vous êtes déconnecté(e)');
  }

  isLoggedIn(): boolean {
    return this.tokenService.isTokenValid();
  }

  getUserRole(): string {
    return this.tokenService.getUserRole();
  }
}
