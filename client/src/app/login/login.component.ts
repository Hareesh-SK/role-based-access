import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    userId: ['ad-321', [Validators.required]],
    password: ['Admin@123', [Validators.required, Validators.minLength(6)]],
  });

  submitted = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      const loginData = {
        userId: this.loginForm.value.userId ?? '',
        password: this.loginForm.value.password ?? ''
      };

      this.apiService.login(loginData).subscribe((response: any) => {
        const { user, token } = response;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.router.navigate(['/dashboard']);
      });
    }
  }
}
