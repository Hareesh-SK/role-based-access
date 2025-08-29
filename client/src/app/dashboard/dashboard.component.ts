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
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @ViewChild('reviewDialog') reviewDialog!: TemplateRef<any>;

  users: any[] = [];
  paginatedUsers: any[] = [];
  clonedUsers: any[] = [];
  currentUser: any;
  isAdmin = false;
  isEdit = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private apiService: ApiService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = this.currentUser?.role === 'Admin';
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getAllUsers().subscribe((res) => {
      this.users = res.map((u) => ({ ...u, _id: u._id || u.userId }));
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      this.setPaginatedUsers();
    });
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

  addUser() {
    const newUser = { userId: '', name: '', email: '', role: 'General User', _id: null, isNew: true };
    this.users.unshift(newUser);
    this.setPaginatedUsers();
  }

  showMessage(msg: string) {
  this.snackBar.open(msg, 'Close', {
    duration: 2500,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['custom-snackbar'] 
  });
}


  toggleEdit() {
    if (!this.isEdit) {
      this.clonedUsers = JSON.parse(JSON.stringify(this.users));
      this.isEdit = true;
    } else {
      this.reviewChanges();
    }
  }

  toggleDelete(user: any) {
    user.markedForDelete = !user.markedForDelete;
  }

  reviewChanges() {
    const newUsers: any[] = [];
    const updatedUsers: any[] = [];
    const deletedUsers: any[] = [];

    for (const current of this.users) {
      const original = this.clonedUsers.find(u => u._id === current._id);

      if (current.markedForDelete && current._id) deletedUsers.push(current);
      else if (!current._id && !current.markedForDelete) newUsers.push(current);
      else if (original && !current.markedForDelete) {
        if (
          current.userId !== original.userId ||
          current.name !== original.name ||
          current.email !== original.email ||
          current.role !== original.role
        ) updatedUsers.push(current);
      }
    }

    const payload = { newUsers, updatedUsers, deletedUsers };

    if (newUsers.length === 0 && updatedUsers.length === 0 && deletedUsers.length === 0) {
      this.showMessage('No changes made in any fields');
      return;
    }

    this.dialog.open(this.reviewDialog, { width: '700px', data: payload });
  }

  saveChanges(payload: any) {
    this.apiService.updateUsers(payload).subscribe({
      next: () => {
        this.showMessage('Changes saved successfully!');
        this.isEdit = false;
        this.loadUsers();
      },
      error: (err) => {
        this.showMessage('Error saving changes!');
        console.error(err);
      }
    });
  }

  cancelEdit() {
    this.users = JSON.parse(JSON.stringify(this.clonedUsers));
    this.isEdit = false;
    this.setPaginatedUsers();
  }

  confirmLogout() {
    const dialogRef = this.dialog.open(this.logoutDialog, { width: '350px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') this.logout();
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
