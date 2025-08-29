import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatIconModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    userId: ['ad-321', [Validators.required]],
    password: ['Admin@123', [Validators.required, Validators.minLength(6)]],
  });

  submitted = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      const loginData = {
        userId: this.loginForm.value.userId ?? '',
        password: this.loginForm.value.password ?? ''
      };

      this.apiService.login(loginData).subscribe((response: any) => {
        if (response.message === 'Invalid credentials') {
          this.snackBar.open('Invalid credentials', 'Close', {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['custom-snackbar']
          });
        } else {
          const { user, token } = response;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

}
