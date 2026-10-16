import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
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
        <h2 data-testid="users-page-title">Users</h2>
        <div class="page-actions">
          <input
            type="text"
            class="search-input"
            placeholder="Search users..."
            data-testid="users-search"
            (input)="onSearch($event)"
          />
          <button class="btn btn-primary" data-testid="users-add-button" (click)="openAddDialog()">
            <span class="material-icons">add</span> Add User
          </button>
        </div>
      </div>

      <div class="users-table card" data-testid="users-table">
        <table>
          <thead>
            <tr>
              <th data-testid="users-header-username">Username</th>
              <th data-testid="users-header-role">Role</th>
              <th data-testid="users-header-status">Status</th>
              <th data-testid="users-header-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users; track user) {
              <tr data-testid="users-table-row">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar" [style.background]="getColor(user)">
                      {{ user.username?.charAt(0).toUpperCase() }}
                    </div>
                    <span data-testid="user-username">{{ user.username }}</span>
                  </div>
                </td>
                <td>
                  <span data-testid="user-role-badge">{{ user.role || 'Member' }}</span>
                </td>
                <td>
                  <span
                    class="badge"
                    [ngClass]="user.status === 'Disabled' ? 'badge-danger' : 'badge-success'"
                    data-testid="user-status-badge"
                  >
                    {{ user.status || 'Active' }}
                  </span>
                </td>
                <td>
                  <button
                    class="icon-btn"
                    data-testid="user-edit-button"
                    (click)="openEditDialog(user)"
                  >
                    <span class="material-icons">edit</span>
                  </button>
                  <button
                    class="icon-btn"
                    data-testid="user-delete-button"
                    (click)="openDeleteDialog(user)"
                  >
                    <span class="material-icons">delete</span>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="empty-row" data-testid="users-empty-state">
                  No users found
                </td>
              </tr>
            }
          </tbody>
        </table>
        <div class="pagination" data-testid="users-pagination">
          <span data-testid="users-pagination-info">
            Showing {{ totalCount ? (page - 1) * pageSize + 1 : 0 }}-{{
              Math.min(page * pageSize, totalCount)
            }}
            of {{ totalCount }} users
          </span>
          @if (totalPages > 1) {
            <div class="page-controls">
              <button
                (click)="goToPage(page - 1)"
                [disabled]="page <= 1"
                data-testid="users-pagination-prev"
              >
                &laquo;
              </button>
              @for (p of pages; track p) {
                <button
                  [class.active]="p === page"
                  (click)="goToPage(p)"
                  data-testid="users-pagination-page"
                >
                  {{ p }}
                </button>
              }
              <button
                (click)="goToPage(page + 1)"
                [disabled]="page >= totalPages"
                data-testid="users-pagination-next"
              >
                &raquo;
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Add/Edit User Dialog -->
      @if (showModal) {
        <div class="modal-overlay" data-testid="user-dialog">
          <div class="modal-content card">
            <h3 data-testid="user-dialog-title">
              {{ editingUser ? 'Edit User' : 'Add New User' }}
            </h3>
            <form [formGroup]="userForm" (ngSubmit)="addUser()">
              <div class="form-group">
                <label>Username</label>
                <input type="text" formControlName="username" data-testid="user-dialog-username" />
              </div>
              <div class="form-group">
                <label>Role</label>
                <select formControlName="role" data-testid="user-dialog-role">
                  <option value="Member">Member</option>
                  <option value="BoardMember">Board Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input
                  type="password"
                  formControlName="password"
                  data-testid="user-dialog-password"
                />
              </div>
              <div class="modal-actions">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-testid="user-dialog-cancel"
                  (click)="showModal = false"
                >
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" data-testid="user-dialog-save">
                  {{ editingUser ? 'Save' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Delete Confirmation Dialog -->
      @if (showDeleteDialog) {
        <div class="modal-overlay" data-testid="user-delete-dialog">
          <div class="modal-content card">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div class="modal-actions">
              <button
                class="btn btn-secondary"
                data-testid="user-delete-cancel"
                (click)="showDeleteDialog = false"
              >
                Cancel
              </button>
              <button
                class="btn btn-danger"
                data-testid="user-delete-confirm"
                (click)="confirmDeleteUser()"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .users-page {
        padding: 24px;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        h2 {
          font-size: 20px;
          font-weight: 600;
        }
      }
      .users-table {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        text-align: left;
        padding: 12px 20px;
        font-size: 13px;
        font-weight: 600;
        color: #1a1918cc;
        border-bottom: 1px solid #e5e4e1;
      }
      th:first-child {
        width: 40%;
      }
      th:not(:first-child) {
        width: 20%;
      }
      td {
        padding: 12px 20px;
        font-size: 14px;
        border-bottom: 1px solid #f5f4f1;
      }
      .empty-row {
        padding: 32px 20px;
        text-align: center;
        font-size: 15px;
        color: #1a1918cc;
      }
      .user-cell {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 13px;
      }
      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #1a1918cc;
        &:hover {
          color: #1a1918;
        }
      }
      .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        font-size: 13px;
        color: #1a1918cc;
      }
      .page-controls {
        display: flex;
        gap: 4px;
        button {
          padding: 6px 10px;
          border: 1px solid #e5e4e1;
          border-radius: 6px;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
          &.active {
            background: #3d8a5a;
            color: #fff;
            border-color: #3d8a5a;
          }
          &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
        }
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-content {
        width: 100%;
        max-width: 400px;
        padding: 32px;
        h3 {
          margin-bottom: 20px;
        }
      }
      .form-group {
        margin-bottom: 16px;
        label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e5e4e1;
          border-radius: 8px;
          font-size: 14px;
          &:focus {
            outline: none;
            border-color: #3d8a5a;
          }
        }
      }
      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .badge-success {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
      }
      .badge-danger {
        background: rgba(220, 53, 69, 0.1);
        color: #dc3545;
      }
      .page-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .search-input {
        padding: 8px 14px;
        border: 1px solid #e5e4e1;
        border-radius: 8px;
        font-size: 14px;
        &:focus {
          outline: none;
          border-color: #3d8a5a;
        }
      }
      select {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #e5e4e1;
        border-radius: 8px;
        font-size: 14px;
        &:focus {
          outline: none;
          border-color: #3d8a5a;
        }
      }
      .btn-danger {
        background: #dc3545;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
      }
      @media (max-width: 768px) {
        .users-page {
          padding: 16px;
        }
        .page-header {
          flex-wrap: wrap;
          gap: 12px;
        }
        .page-actions {
          flex: 1 1 100%;
          flex-wrap: wrap;
        }
        .search-input {
          flex: 1 1 160px;
          min-width: 0;
        }
      }
    `,
  ],
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  Math = Math;
  users: any[] = [];
  page = 1;
  pageSize = 2;
  totalCount = 0;
  totalPages = 1;
  pages: number[] = [1];
  showModal = false;
  showDeleteDialog = false;
  editingUser: any = null;
  deletingUser: any = null;

  userForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['Member'],
  });

  private colors = ['#3D8A5A', '#3B82F6', '#F59E0B', '#DC3545', '#8B5CF6', '#EC4899'];

  ngOnInit(): void {
    this.loadUsers();
  }

  private allUsers: any[] = [];
  private matchingUsers: any[] = [];
  private query = '';

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.allUsers = Array.isArray(data) ? data : data?.users || [];
        this.applySearch();
      },
      error: () => {},
    });
  }

  /** Filters by the search query, then pages the matches. */
  private applySearch(): void {
    this.matchingUsers = this.query
      ? this.allUsers.filter((u: any) => (u.username || '').toLowerCase().includes(this.query))
      : this.allUsers;
    this.totalCount = this.matchingUsers.length;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.page = Math.min(this.page, this.totalPages);
    this.showPage();
  }

  private showPage(): void {
    this.users = this.matchingUsers.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize,
    );
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.showPage();
  }

  addUser(): void {
    if (this.userForm.invalid) return;
    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.showModal = false;
        this.userForm.reset();
        this.loadUsers();
      },
      error: () => {},
    });
  }

  onSearch(event: any): void {
    this.query = (event.target.value || '').toLowerCase();
    this.page = 1;
    this.applySearch();
  }

  openAddDialog(): void {
    this.editingUser = null;
    this.userForm.reset({ role: 'Member' });
    this.showModal = true;
  }

  openEditDialog(user: any): void {
    this.editingUser = user;
    this.userForm.patchValue({ username: user.username, role: user.role || 'Member' });
    this.showModal = true;
  }

  openDeleteDialog(user: any): void {
    this.deletingUser = user;
    this.showDeleteDialog = true;
  }

  confirmDeleteUser(): void {
    if (this.deletingUser) {
      this.userService.deleteUser(this.deletingUser.userId || this.deletingUser.id).subscribe({
        next: () => {
          this.showDeleteDialog = false;
          this.loadUsers();
        },
        error: () => {
          this.showDeleteDialog = false;
        },
      });
    }
  }

  getColor(user: any): string {
    const idx = (user.username || '').charCodeAt(0) % this.colors.length;
    return this.colors[idx];
  }
}
