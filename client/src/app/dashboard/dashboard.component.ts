import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

   @ViewChild('logoutDialog') logoutDialog!: TemplateRef<any>;
  users: any[] = [];
  paginatedUsers: any[] = [];
  clonedUsers: any[] = [];
  currentUser: any;
  isAdmin = false;
  isEdit = false;
  message = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  // For Material Table
  displayedColumns: string[] = ['userId', 'name', 'email', 'role'];

  constructor(private apiService: ApiService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = this.currentUser?.role === 'Admin';
    this.loadUsers();
  }

 loadUsers() {
  this.apiService.getAllUsers().subscribe((res) => {
    // assign a stable internal id if not exists
    this.users = res.map((u) => ({ ...u, _id: u._id || u.userId }));
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    this.setPaginatedUsers();
  });
}


  addUser() {
    const newUser = { userId: '', name: '', email: '', role: 'General User', _id: null, isNew: true };
    this.users.unshift(newUser);
    this.setPaginatedUsers();
  }

  

  setPaginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPaginatedUsers();
  }

  toggleEdit() {
    if (!this.isEdit) {
      this.clonedUsers = JSON.parse(JSON.stringify(this.users));
      this.isEdit = true;
      this.message = '';
    } else {
      this.saveChanges();
    }
  }

  confirmLogout() {
    const dialogRef = this.dialog.open(this.logoutDialog, {
      width: '350px',
      data: {},
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.logout(); // your existing logout logic
      }
    });
  }


  saveChanges() {
    const newUsers: any[] = [];
    const updatedUsers: any[] = [];

    for (let i = 0; i < this.users.length; i++) {
      const current = this.users[i];
      const original = this.clonedUsers.find(u => u._id === current._id);

      if (!current._id) {
        // Newly added user from UI (no _id yet)
        newUsers.push(current);
      } else if (original) {
        // Compare fields for existing users
        if (
          current.userId !== original.userId ||
          current.name !== original.name ||
          current.email !== original.email ||
          current.role !== original.role
        ) {
          updatedUsers.push(current);
        }
      }
    }

    if (newUsers.length === 0 && updatedUsers.length === 0) {
      this.message = 'No changes made in any fields';
      this.isEdit = false;
      return;
    }

    // Object with both arrays
    const payload = {
      newUsers,
      updatedUsers
    };

    this.apiService.updateUsers(payload).subscribe({
      next: (res) => {
        this.message = 'Changes saved successfully!';
        this.isEdit = false;
        this.loadUsers(); // reload to get fresh ids
      },
      error: (err) => {
        this.message = 'Error saving changes!';
        console.error(err);
      }
    });
  }


  cancelEdit() {
    this.users = JSON.parse(JSON.stringify(this.clonedUsers));
    this.isEdit = false;
    this.setPaginatedUsers();
    this.message = '';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
