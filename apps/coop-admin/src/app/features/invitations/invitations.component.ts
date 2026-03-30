import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvitationService } from '../../core/services/invitation.service';
import { TopbarComponent } from '../../layout/topbar.component';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TopbarComponent],
  template: `
    <app-topbar title="Invitations"></app-topbar>
    <div class="invitations-page">
      <div class="page-header">
        <h2 data-testid="invitations-page-title">Invitations</h2>
        <button class="btn btn-primary" data-testid="invitations-create-button" (click)="showModal = true">
          <span class="material-icons">add</span> Create Invitation
        </button>
      </div>

      <div class="invitations-table card" data-testid="invitations-table">
        <table>
          <thead>
            <tr>
              <th data-testid="invitations-header-token">Token</th>
              <th data-testid="invitations-header-type">Type</th>
              <th data-testid="invitations-header-expires">Expires</th>
              <th data-testid="invitations-header-status">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inv of invitations" data-testid="invitation-row">
              <td class="token-cell" data-testid="invitation-token">{{ inv.value || inv.token }}</td>
              <td data-testid="invitation-type">{{ getTypeName(inv.type) }}</td>
              <td data-testid="invitation-expires">{{ (inv.expirationDate || inv.expiresOn) | date:'mediumDate' }}</td>
              <td>
                <span class="badge" [ngClass]="getStatusClass(inv)" data-testid="invitation-status-badge">{{ getStatus(inv) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Invitation Dialog -->
      <div *ngIf="showModal" class="modal-overlay" data-testid="invitation-create-dialog">
        <div class="modal-content card">
          <h3>Create Invitation</h3>
          <form [formGroup]="invForm" (ngSubmit)="createInvitation()">
            <div class="form-group">
              <label>Type</label>
              <select formControlName="type" data-testid="invitation-dialog-type">
                <option value="Member">Member</option>
                <option value="BoardMember">Board Member</option>
                <option value="StaffMember">Staff</option>
              </select>
            </div>
            <div class="form-group">
              <label>Expires</label>
              <input type="date" formControlName="expires" data-testid="invitation-dialog-expires" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-testid="invitation-dialog-cancel" (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" data-testid="invitation-dialog-create">Create</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Token Display Dialog -->
      <div *ngIf="showTokenDialog" class="modal-overlay" data-testid="invitation-token-dialog">
        <div class="modal-content card">
          <h3>Invitation Created</h3>
          <p class="token-display" data-testid="invitation-token-value">{{ createdToken }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" data-testid="invitation-token-copy" (click)="copyToken()">Copy</button>
            <button class="btn btn-primary" data-testid="invitation-token-close" (click)="showTokenDialog = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invitations-page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
      h2 { font-size: 20px; font-weight: 600; }
    }
    .invitations-table { overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px 20px; font-size: 13px; font-weight: 600; color: #1A1918CC; border-bottom: 1px solid #E5E4E1; }
    td { padding: 12px 20px; font-size: 14px; border-bottom: 1px solid #F5F4F1; }
    .token-cell { font-family: monospace; font-size: 13px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { width: 100%; max-width: 400px; padding: 32px; h3 { margin-bottom: 20px; } }
    .form-group { margin-bottom: 16px;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
      select, input { width: 100%; padding: 10px 14px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px; }
    }
    .token-display { font-family: monospace; font-size: 16px; background: #F5F4F1; padding: 12px; border-radius: 8px; word-break: break-all; margin: 12px 0; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
    .badge-success { background: rgba(16,185,129,0.1); color: #059669; }
    .badge-danger { background: rgba(220,53,69,0.1); color: #DC3545; }
    .badge-gray { background: rgba(26,25,24,0.06); color: #1A1918CC; }
  `]
})
export class InvitationsComponent implements OnInit {
  private invService = inject(InvitationService);
  private fb = inject(FormBuilder);

  invitations: any[] = [];
  showModal = false;
  showTokenDialog = false;
  createdToken = '';
  invForm: FormGroup = this.fb.group({ type: ['Member'], expires: [''] });

  ngOnInit(): void {
    this.loadInvitations();
  }

  private loadInvitations(): void {
    this.invService.getInvitations().subscribe({
      next: (data: any) => {
        this.invitations = Array.isArray(data) ? data : (data?.invitationTokens || []);
      },
      error: () => {}
    });
  }

  private typeMap: Record<string, number> = { 'Member': 0, 'BoardMember': 1, 'StaffMember': 2 };

  createInvitation(): void {
    const formVal = this.invForm.value;
    const typeInt = this.typeMap[formVal.type] ?? 0;
    const value = 'inv-' + Math.random().toString(36).substring(2, 10);
    const body: any = { type: typeInt, value };
    if (formVal.expires) { body.expirationDate = formVal.expires; }
    this.invService.createInvitation(body).subscribe({
      next: (data: any) => {
        this.showModal = false;
        const inv = data?.invitationToken ?? data;
        this.createdToken = inv?.value || value;
        this.showTokenDialog = true;
        this.loadInvitations();
      },
      error: () => { this.showModal = false; }
    });
  }

  copyToken(): void {
    navigator.clipboard?.writeText(this.createdToken);
  }

  getTypeName(type: any): string {
    const names: Record<number, string> = { 0: 'Member', 1: 'Board Member', 2: 'Staff' };
    if (typeof type === 'number') return names[type] || 'Member';
    return type || 'Member';
  }

  getStatus(inv: any): string {
    if (inv.redeemed || inv.hasBeenRedeemed || inv.status === 'Used') return 'Used';
    const expires = inv.expiresOn || inv.expirationDate;
    if (expires && new Date(expires) < new Date()) return 'Expired';
    return 'Active';
  }

  getStatusClass(inv: any): string {
    const status = this.getStatus(inv);
    if (status === 'Active') return 'badge-success';
    if (status === 'Expired') return 'badge-danger';
    return 'badge-gray';
  }
}
