import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { TopbarComponent } from '../../layout/topbar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TopbarComponent],
  template: `
    <app-topbar title="Users"></app-topbar>
    <div class="users-page">
      <div class="page-header">
        <h2>User Management</h2>
        <button class="btn btn-primary" data-testid="users-add-btn" (click)="showModal = true">
          <span class="material-icons">add</span> Add User
        </button>
      </div>

      <div class="users-table card">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users" data-testid="user-row">
              <td>
                <div class="user-cell">
                  <div class="user-avatar" [style.background]="getColor(user)">{{ user.username?.charAt(0).toUpperCase() }}</div>
                  {{ user.username }}
                </div>
              </td>
              <td>{{ user.role || 'Member' }}</td>
              <td>
                <span class="badge" [ngClass]="user.status === 'Disabled' ? 'badge-danger' : 'badge-success'">
                  {{ user.status || 'Active' }}
                </span>
              </td>
              <td>
                <button class="icon-btn" data-testid="user-edit-btn"><span class="material-icons">edit</span></button>
                <button class="icon-btn" data-testid="user-delete-btn"><span class="material-icons">delete</span></button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <span>Showing {{ (page - 1) * pageSize + 1 }}-{{ Math.min(page * pageSize, totalCount) }} of {{ totalCount }} users</span>
          <div class="page-controls">
            <button (click)="goToPage(page - 1)" [disabled]="page <= 1">&laquo;</button>
            <button *ngFor="let p of pages" [class.active]="p === page" (click)="goToPage(p)">{{ p }}</button>
            <button (click)="goToPage(page + 1)" [disabled]="page >= totalPages">&raquo;</button>
          </div>
        </div>
      </div>

      <!-- Add User Modal -->
      <div *ngIf="showModal" class="modal-overlay">
        <div class="modal-content card">
          <h3>Add New User</h3>
          <form [formGroup]="userForm" (ngSubmit)="addUser()">
            <div class="form-group">
              <label>Username</label>
              <input type="text" formControlName="username" data-testid="user-username-input" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" formControlName="password" data-testid="user-password-input" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
      h2 { font-size: 20px; font-weight: 600; }
    }
    .users-table { overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px 20px; font-size: 13px; font-weight: 600; color: #1A1918CC; border-bottom: 1px solid #E5E4E1; }
    td { padding: 12px 20px; font-size: 14px; border-bottom: 1px solid #F5F4F1; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 50%; color: #fff;
      display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px;
    }
    .icon-btn { background: none; border: none; cursor: pointer; padding: 4px; color: #1A1918CC;
      &:hover { color: #1A1918; }
    }
    .pagination { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; font-size: 13px; color: #1A1918CC; }
    .page-controls { display: flex; gap: 4px;
      button { padding: 6px 10px; border: 1px solid #E5E4E1; border-radius: 6px; background: #fff; cursor: pointer; font-size: 13px;
        &.active { background: #3D8A5A; color: #fff; border-color: #3D8A5A; }
        &:disabled { opacity: 0.4; cursor: not-allowed; }
      }
    }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { width: 100%; max-width: 400px; padding: 32px;
      h3 { margin-bottom: 20px; }
    }
    .form-group { margin-bottom: 16px;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
      input { width: 100%; padding: 10px 14px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px;
        &:focus { outline: none; border-color: #3D8A5A; }
      }
    }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
    .badge-success { background: rgba(16,185,129,0.1); color: #059669; }
    .badge-danger { background: rgba(220,53,69,0.1); color: #DC3545; }
  `]
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  Math = Math;
  users: any[] = [];
  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 1;
  pages: number[] = [1];
  showModal = false;

  userForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  private colors = ['#3D8A5A', '#3B82F6', '#F59E0B', '#DC3545', '#8B5CF6', '#EC4899'];

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsersPage(this.page, this.pageSize).subscribe({
      next: (data: any) => {
        this.users = data?.entities || data?.users || [];
        this.totalCount = data?.length || data?.totalCount || this.users.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: () => {
        this.userService.getUsers().subscribe({
          next: (data: any) => {
            const all = Array.isArray(data) ? data : (data?.users || []);
            this.totalCount = all.length;
            this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;
            this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
            this.users = all.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
          },
          error: () => {}
        });
      }
    });
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadUsers();
  }

  addUser(): void {
    if (this.userForm.invalid) return;
    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.showModal = false;
        this.userForm.reset();
        this.loadUsers();
      },
      error: () => {}
    });
  }

  getColor(user: any): string {
    const idx = (user.username || '').charCodeAt(0) % this.colors.length;
    return this.colors[idx];
  }
}
