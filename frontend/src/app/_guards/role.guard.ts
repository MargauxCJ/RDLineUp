import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import {AuthService} from '../_services/auth/auth.service';
import {ToastService} from '../_services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getUserRole();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if(userRole === 'admin') {
      return true;
    }

    if (expectedRoles.includes(userRole)) {
      return true;
    } else {
      this.toastService.presentToast('Accès non authorisé')
      this.router.navigate(['/login']);
      return false;
    }
  }
}
