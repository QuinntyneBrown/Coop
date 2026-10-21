import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent, ChipComponent, IconComponent } from 'components';
import { RoleService } from '../../core/services/role.service';
import { PrivilegeService } from '../../core/services/privilege.service';
import { plainName } from '../../core/plain-name';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [IconComponent, ButtonComponent, ChipComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RolesComponent implements OnInit {
  readonly plainName = plainName;
  private roleService = inject(RoleService);
  private privilegeService = inject(PrivilegeService);

  roles: any[] = [];
  selectedRole: any = null;
  rolePrivileges: any[] = [];

  rowId(priv: any): string {
    return 'pv-row-' + (priv.aggregate || '').toLowerCase();
  }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: (data: any) => {
        this.roles = Array.isArray(data) ? data : data?.roles || [];
        if (this.roles.length > 0) {
          const sysAdmin = this.roles.find((r: any) => r.name === 'SystemAdministrator');
          this.selectRole(sysAdmin || this.roles[0]);
        }
      },
      error: () => {},
    });
  }

  selectRole(role: any): void {
    this.selectedRole = role;
    const rawPrivileges = role.privileges || [];
    if (rawPrivileges.length > 0) {
      this.buildPrivilegeMatrix(rawPrivileges);
    }
    // Load from server when no cached data, or refresh in background
    if (role.roleId) {
      this.roleService.getRoleById(role.roleId).subscribe({
        next: (data: any) => {
          const role2 = data?.role || data;
          const privs = role2?.privileges || data?.privileges || [];
          role.privileges = privs;
          this.buildPrivilegeMatrix(privs);
        },
        error: () => {
          if (rawPrivileges.length === 0) {
            this.buildPrivilegeMatrix([]);
          }
        },
      });
    }
  }

  private groupAggregateMap: Record<string, string> = {
    Notice: 'Document',
    ByLaw: 'Document',
    Report: 'Document',
    Member: 'Profile',
    BoardMember: 'Profile',
    StaffMember: 'Profile',
  };

  private buildPrivilegeMatrix(privileges: any[]): void {
    // AccessRight enum: None=0, Read=1, Write=2, Create=3, Delete=4
    const accessRightMap: Record<number, string> = {
      1: 'canRead',
      2: 'canUpdate',
      3: 'canCreate',
      4: 'canDelete',
    };
    const aggregateMap: Record<string, any> = {};

    for (const priv of privileges) {
      const rawAggregate = priv.aggregate || 'Unknown';
      const aggregate = this.groupAggregateMap[rawAggregate] || rawAggregate;
      if (!aggregateMap[aggregate]) {
        aggregateMap[aggregate] = {
          aggregate,
          canRead: false,
          canUpdate: false,
          canCreate: false,
          canDelete: false,
          privilegeIds: {},
          allPrivilegeIds: {},
        };
      }
      const field = accessRightMap[priv.accessRight];
      if (field) {
        aggregateMap[aggregate][field] = true;
        aggregateMap[aggregate].privilegeIds[field] = priv.privilegeId;
        // Track ALL privilege IDs for grouped aggregates (e.g., Document groups Notice, ByLaw, Report)
        if (!aggregateMap[aggregate].allPrivilegeIds[field]) {
          aggregateMap[aggregate].allPrivilegeIds[field] = [];
        }
        aggregateMap[aggregate].allPrivilegeIds[field].push(priv.privilegeId);
      }
    }

    // Sort: User, MaintenanceRequest, Document, Profile first
    const order = ['User', 'MaintenanceRequest', 'Document', 'Profile'];
    this.rolePrivileges = Object.values(aggregateMap).sort((a: any, b: any) => {
      const ai = order.indexOf(a.aggregate);
      const bi = order.indexOf(b.aggregate);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.aggregate.localeCompare(b.aggregate);
    });
  }

  togglePrivilege(priv: any, field: string): void {
    const wasChecked = (priv as any)[field];
    (priv as any)[field] = !wasChecked;

    const accessRightReverseMap: Record<string, number> = {
      canRead: 1,
      canUpdate: 2,
      canCreate: 3,
      canDelete: 4,
    };
    // Map grouped aggregates back to original names for API calls
    const reverseGroupMap: Record<string, string[]> = {
      Document: ['Notice', 'ByLaw', 'Report'],
      Profile: ['Member', 'BoardMember', 'StaffMember'],
    };
    const aggregates = reverseGroupMap[priv.aggregate] || [priv.aggregate];
    const aggregate = aggregates[0]; // Use first one for create

    if (wasChecked) {
      // Remove ALL privileges for grouped aggregates (e.g., Document groups Notice, ByLaw, Report)
      const allIds: string[] = priv.allPrivilegeIds?.[field] || [];
      const singleId = priv.privilegeIds?.[field];
      const idsToDelete = allIds.length > 0 ? allIds : singleId ? [singleId] : [];
      for (const privId of idsToDelete) {
        this.privilegeService.deletePrivilege(privId).subscribe({
          next: () => {
            if (this.selectedRole?.privileges) {
              this.selectedRole.privileges = this.selectedRole.privileges.filter(
                (p: any) => p.privilegeId !== privId,
              );
            }
          },
          error: () => {},
        });
      }
      // Clear tracked IDs
      if (priv.allPrivilegeIds) {
        priv.allPrivilegeIds[field] = [];
      }
      if (priv.privilegeIds) {
        delete priv.privilegeIds[field];
      }
    } else {
      // Create privileges for ALL sub-aggregates in the group
      for (const agg of aggregates) {
        const payload = {
          roleId: this.selectedRole.roleId,
          aggregate: agg,
          accessRight: accessRightReverseMap[field],
        };
        this.privilegeService.createPrivilege(payload).subscribe({
          next: (result: any) => {
            const newPriv = result?.privilege || result;
            if (newPriv?.privilegeId) {
              priv.privilegeIds = priv.privilegeIds || {};
              priv.privilegeIds[field] = newPriv.privilegeId;
              priv.allPrivilegeIds = priv.allPrivilegeIds || {};
              if (!priv.allPrivilegeIds[field]) {
                priv.allPrivilegeIds[field] = [];
              }
              priv.allPrivilegeIds[field].push(newPriv.privilegeId);
              if (this.selectedRole?.privileges) {
                this.selectedRole.privileges.push(newPriv);
              }
            }
          },
          error: () => {},
        });
      }
    }
  }
}
