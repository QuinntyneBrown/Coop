import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BadgeComponent,
  BadgeTone,
  ButtonComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  SelectComponent,
  TableComponent,
  TableWrapComponent,
  TextFieldComponent,
} from 'components';
import { InvitationService } from '../../core/services/invitation.service';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ButtonComponent,
    BadgeComponent,
    TableComponent,
    TableWrapComponent,
    FieldLabelComponent,
    FormFieldComponent,
    SelectComponent,
    TextFieldComponent,
  ],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class InvitationsComponent implements OnInit, AfterViewChecked {
  private invService = inject(InvitationService);
  private fb = inject(FormBuilder);

  invitations: any[] = [];
  showModal = false;
  showTokenDialog = false;
  createdToken = '';
  invForm: FormGroup = this.fb.group({ type: ['Member'], expires: [''] });

  private readonly createDialog = viewChild<ElementRef<HTMLDialogElement>>('createDialog');
  private readonly tokenDialog = viewChild<ElementRef<HTMLDialogElement>>('tokenDialog');

  // The flags above decide which dialog is open; the native dialogs follow them.
  ngAfterViewChecked(): void {
    const dialogs: [HTMLDialogElement | undefined, boolean][] = [
      [this.createDialog()?.nativeElement, this.showModal],
      [this.tokenDialog()?.nativeElement, this.showTokenDialog],
    ];
    for (const [dialog, open] of dialogs) {
      if (dialog?.open && !open) dialog.close();
    }
    for (const [dialog, open] of dialogs) {
      if (dialog && !dialog.open && open) dialog.showModal();
    }
  }

  ngOnInit(): void {
    this.loadInvitations();
  }

  private loadInvitations(): void {
    this.invService.getInvitations().subscribe({
      next: (data: any) => {
        this.invitations = Array.isArray(data) ? data : data?.invitationTokens || [];
      },
      error: () => {},
    });
  }

  private typeMap: Record<string, number> = { Member: 0, BoardMember: 1, StaffMember: 2 };

  createInvitation(): void {
    const formVal = this.invForm.value;
    const typeInt = this.typeMap[formVal.type] ?? 0;
    const value = 'inv-' + Math.random().toString(36).substring(2, 10);
    const body: any = { type: typeInt, value };
    if (formVal.expires) {
      body.expirationDate = formVal.expires;
    }
    this.invService.createInvitation(body).subscribe({
      next: (data: any) => {
        this.showModal = false;
        const inv = data?.invitationToken ?? data;
        this.createdToken = inv?.value || value;
        this.showTokenDialog = true;
        this.loadInvitations();
      },
      error: () => {
        this.showModal = false;
      },
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

  getStatusTone(inv: any): BadgeTone {
    const status = this.getStatus(inv);
    if (status === 'Active') return 'success';
    if (status === 'Expired') return 'danger';
    return 'neutral';
  }
}
