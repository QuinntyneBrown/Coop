import {
  Component,
  ElementRef,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  PaginationComponent,
  PaginationLinkComponent,
  PaginationListComponent,
  SearchFieldComponent,
  SelectComponent,
  TableComponent,
  TableWrapComponent,
  TextFieldComponent,
} from 'components';
import { UserService } from '../../core/services/user.service';
import { userRoleNames } from '../../core/user-role-names';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IconComponent,
    ButtonComponent,
    AvatarComponent,
    BadgeComponent,
    CardComponent,
    TableComponent,
    TableWrapComponent,
    FieldLabelComponent,
    FormFieldComponent,
    SearchFieldComponent,
    SelectComponent,
    TextFieldComponent,
    PaginationComponent,
    PaginationLinkComponent,
    PaginationListComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private readonly userDialog = viewChild<ElementRef<HTMLDialogElement>>('userDialog');
  private readonly deleteDialog = viewChild<ElementRef<HTMLDialogElement>>('deleteDialog');

  Math = Math;
  roleNames = userRoleNames;
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
        this.closeUserDialog();
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
    this.openUserDialog();
  }

  openEditDialog(user: any): void {
    this.editingUser = user;
    this.userForm.patchValue({ username: user.username, role: user.role || 'Member' });
    this.openUserDialog();
  }

  closeUserDialog(): void {
    this.showModal = false;
    this.userDialog()?.nativeElement.close();
  }

  private openUserDialog(): void {
    this.showModal = true;
    this.userDialog()?.nativeElement.showModal();
  }

  openDeleteDialog(user: any): void {
    this.deletingUser = user;
    this.showDeleteDialog = true;
    this.deleteDialog()?.nativeElement.showModal();
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.deleteDialog()?.nativeElement.close();
  }

  confirmDeleteUser(): void {
    if (this.deletingUser) {
      this.userService.deleteUser(this.deletingUser.userId || this.deletingUser.id).subscribe({
        next: () => {
          this.closeDeleteDialog();
          this.loadUsers();
        },
        error: () => {
          this.closeDeleteDialog();
        },
      });
    }
  }
}
