import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonButton, IonCard, IonCol, IonContent, IonGrid, IonInput, IonRow} from '@ionic/angular/standalone';
import {switchMap} from 'rxjs';
import {AuthService} from '../../_services/auth/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../../_services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonGrid, IonCol, IonRow, IonInput, IonButton, ReactiveFormsModule]
})
export class LoginPage {
  public loginForm = this.formBuilder.group({
    login: [null as unknown as string, [Validators.email, Validators.required]],
    password: [null as unknown as string, Validators.required],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    private toastService: ToastService
  ) {
  }

  public login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.controls.login.value;
    const password = this.loginForm.controls.password.value;

    this.authService.login(email, password).pipe(
      switchMap(() => this.authService.getCurrentUser())
    ).subscribe({
      next: (user) => {
          this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.toastService.displayError(err.error);
      }
    });
  }

}
