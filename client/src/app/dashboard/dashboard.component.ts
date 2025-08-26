import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  currentUser: any;
  isAdmin = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = this.currentUser?.role === 'admin';

    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getAllUsers().subscribe((res) => {
      this.users = res;
    });
  }

  editUser(user: any) {
    alert(`Editing user: ${user.name}`);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
