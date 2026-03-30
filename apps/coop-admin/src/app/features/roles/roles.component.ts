import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../core/services/role.service';
import { PrivilegeService } from '../../core/services/privilege.service';
import { TopbarComponent } from '../../layout/topbar.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, TopbarComponent],
  template: `
    <app-topbar title="Roles & Privileges"></app-topbar>
    <div class="roles-page">
      <div class="roles-layout">
        <!-- Role List -->
        <div class="role-list card" data-testid="roles-panel">
          <h3 data-testid="roles-panel-title">Roles</h3>
          <div *ngFor="let role of roles" data-testid="role-card">
            <div class="role-item" [class.selected]="selectedRole?.roleId === role.roleId"
              (click)="selectRole(role)"
              [attr.data-testid]="'role-card-' + (role.name || '').toLowerCase()"
              [attr.data-selected]="selectedRole?.roleId === role.roleId ? 'true' : null">
              <span class="material-icons role-icon">shield</span>
              <span>{{ role.name }}</span>
            </div>
          </div>
        </div>

        <!-- Privileges Table -->
        <div class="privileges-panel card" *ngIf="selectedRole" data-testid="privileges-panel">
          <div class="privileges-header">
            <h3 data-testid="privileges-panel-title">{{ selectedRole.name }} - Privileges</h3>
            <button class="btn btn-primary btn-sm" data-testid="add-privilege-button">
              <span class="material-icons">add</span> Add Privilege
            </button>
          </div>
          <table class="privileges-table" data-testid="privileges-table">
            <thead>
              <tr>
                <th data-testid="privilege-header-aggregate">Aggregate</th>
                <th data-testid="privilege-header-read">Read</th>
                <th data-testid="privilege-header-write">Write</th>
                <th data-testid="privilege-header-create">Create</th>
                <th data-testid="privilege-header-delete">Delete</th>
              </tr>
            </thead>
            <tbody *ngFor="let priv of rolePrivileges" data-testid="privilege-row">
              <tr [attr.data-testid]="'privilege-row-' + (priv.aggregate || '').toLowerCase()">
                <td>{{ priv.aggregate }}</td>
                <td><input type="checkbox" [checked]="priv.canRead" class="privilege-toggle" data-testid="privilege-read" (change)="togglePrivilege(priv, 'canRead')" /></td>
                <td><input type="checkbox" [checked]="priv.canUpdate" class="privilege-toggle" data-testid="privilege-write" (change)="togglePrivilege(priv, 'canUpdate')" /></td>
                <td><input type="checkbox" [checked]="priv.canCreate" class="privilege-toggle" data-testid="privilege-create" (change)="togglePrivilege(priv, 'canCreate')" /></td>
                <td><input type="checkbox" [checked]="priv.canDelete" class="privilege-toggle" data-testid="privilege-delete" (change)="togglePrivilege(priv, 'canDelete')" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .roles-page { padding: 24px; }
    .roles-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; }
    .role-list { padding: 20px;
      h3 { margin-bottom: 16px; font-size: 16px; font-weight: 600; }
    }
    .role-item {
      display: flex; align-items: center; gap: 10px; padding: 10px 14px;
      border-radius: 10px; cursor: pointer; font-size: 14px; margin-bottom: 4px;
      &:hover { background: #F5F4F1; }
      &.selected { background: #3D8A5A; color: #fff; }
    }
    .role-icon { font-size: 18px; }
    .privileges-panel { padding: 20px; overflow-x: auto; }
    .privileges-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
      h3 { font-size: 16px; font-weight: 600; }
    }
    .btn-sm { padding: 6px 14px; font-size: 13px; }
    .privileges-table { width: 100%; border-collapse: collapse; }
    .privileges-table th { text-align: left; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1A1918CC; border-bottom: 1px solid #E5E4E1; }
    .privileges-table td { padding: 10px 16px; font-size: 14px; border-bottom: 1px solid #F5F4F1; }
    .privilege-toggle { width: 18px; height: 18px; accent-color: #3D8A5A; cursor: pointer; }
    @media (max-width: 768px) {
      .roles-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class RolesComponent implements OnInit {
  private roleService = inject(RoleService);
  private privilegeService = inject(PrivilegeService);

  roles: any[] = [];
  selectedRole: any = null;
  rolePrivileges: any[] = [];

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: (data: any) => {
        this.roles = Array.isArray(data) ? data : (data?.roles || []);
        if (this.roles.length > 0) this.selectRole(this.roles[0]);
      },
      error: () => {}
    });
  }

  selectRole(role: any): void {
    this.selectedRole = role;
    this.rolePrivileges = role.privileges || [];
    if (this.rolePrivileges.length === 0 && role.roleId) {
      this.roleService.getRoleById(role.roleId).subscribe({
        next: (data: any) => {
          this.rolePrivileges = data?.privileges || [];
        },
        error: () => {}
      });
    }
  }

  togglePrivilege(priv: any, field: string): void {
    (priv as any)[field] = !(priv as any)[field];
    this.privilegeService.updatePrivilege(priv).subscribe({ error: () => {} });
  }
}
