import {
  Component,
  ElementRef,
  OnInit,
  inject,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertBodyComponent,
  AlertComponent,
  AvatarComponent,
  BadgeComponent,
  BadgeTone,
  ButtonComponent,
  CardComponent,
  CardTitleComponent,
  DescriptionListComponent,
  DividerComponent,
  EmptyStateComponent,
  EmptyStateIconComponent,
  EmptyStateTextComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  ListBodyComponent,
  ListComponent,
  ListItemComponent,
  ListMetaComponent,
  ListTitleComponent,
  LoadingComponent,
  PictureListGridComponent,
  PictureListItemComponent,
  PictureListNoteComponent,
  PictureListThumbComponent,
  SelectComponent,
  SpinnerComponent,
  TabComponent,
  TabPanelComponent,
  TabsComponent,
  TextFieldComponent,
  TextareaComponent,
} from 'components';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { ProfileService } from '../../core/services/profile.service';
import { MaintenanceStep } from './maintenance-step';
import { nextMaintenanceStep } from './next-maintenance-step';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ButtonComponent,
    AvatarComponent,
    BadgeComponent,
    CardComponent,
    CardTitleComponent,
    DescriptionListComponent,
    DividerComponent,
    EmptyStateComponent,
    EmptyStateIconComponent,
    EmptyStateTextComponent,
    ListBodyComponent,
    ListComponent,
    ListItemComponent,
    ListMetaComponent,
    ListTitleComponent,
    PictureListGridComponent,
    PictureListItemComponent,
    PictureListNoteComponent,
    PictureListThumbComponent,
    AlertBodyComponent,
    AlertComponent,
    LoadingComponent,
    SpinnerComponent,
    FieldLabelComponent,
    FormFieldComponent,
    SelectComponent,
    TextFieldComponent,
    TextareaComponent,
    TabComponent,
    TabPanelComponent,
    TabsComponent,
  ],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MaintenanceComponent implements OnInit {
  private maintenanceService = inject(MaintenanceService);
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);

  requests: any[] = [];
  filteredRequests: any[] = [];
  selectedRequest: any = null;
  comments: any[] = [];
  activeFilter = 'all';
  readonly filters = [
    { key: 'all', label: 'All', testId: 'all' },
    { key: 'new', label: 'New', testId: 'new' },
    { key: 'received', label: 'Received', testId: 'received' },
    { key: 'started', label: 'Started', testId: 'started' },
    { key: 'done', label: 'Completed', testId: 'completed' },
  ];
  readonly listHeadings: Record<string, string> = {
    all: 'All Requests',
    new: 'New Requests',
    received: 'Received Requests',
    started: 'Started Requests',
    done: 'Completed Requests',
  };
  activeTab = 'details';
  loading = true;
  showCreateModal = false;
  advancing = false;
  stepFailed = false;
  readonly nextStep = nextMaintenanceStep;
  photoUrls: Record<string, string> = {};
  submitterPhotoUrl = '';

  createForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: [''],
    category: [''],
  });

  commentControl = this.fb.control('');

  private readonly createDialog = viewChild.required<ElementRef<HTMLDialogElement>>('createDialog');

  ngOnInit(): void {
    this.loadRequests();
  }

  private loadRequests(): void {
    this.loading = true;
    this.maintenanceService.getMaintenanceRequests().subscribe({
      next: (data: any) => {
        this.requests = Array.isArray(data) ? data : data?.maintenanceRequests || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.maintenanceService.getCurrentUserMaintenanceRequests().subscribe({
          next: (data: any) => {
            this.requests = Array.isArray(data) ? data : data?.maintenanceRequests || [];
            this.applyFilter();
            this.loading = false;
          },
          error: () => {
            this.requests = [];
            this.filteredRequests = [];
            this.loading = false;
          },
        });
      },
    });
  }

  filterBy(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredRequests = [...this.requests];
    } else {
      const map: Record<string, (string | number)[]> = {
        new: ['New', 'Created', 0],
        received: ['Received', 1],
        started: ['Started', 'InProgress', 2],
        done: ['Completed', 'Complete', 'Done', 3],
      };
      const statuses = map[this.activeFilter] || [];
      this.filteredRequests = this.requests.filter((r) => statuses.includes(r.status));
    }
  }

  advance(step: MaintenanceStep): void {
    const request = this.selectedRequest;
    if (!request?.maintenanceRequestId) return;
    const calls = {
      receive: (id: string) => this.maintenanceService.receiveMaintenanceRequest(id),
      start: (id: string) => this.maintenanceService.startMaintenanceRequest(id),
      complete: (id: string) => this.maintenanceService.completeMaintenanceRequest(id),
    };
    this.advancing = true;
    this.stepFailed = false;
    calls[step.action](request.maintenanceRequestId).subscribe({
      next: (data: any) => {
        const updated = data?.maintenanceRequest || data;
        request.status = updated?.status ?? request.status;
        this.applyFilter();
        this.advancing = false;
      },
      error: () => {
        this.stepFailed = true;
        this.advancing = false;
      },
    });
  }

  isSelected(req: any): boolean {
    return this.selectedRequest?.maintenanceRequestId === req.maintenanceRequestId;
  }

  openCreate(): void {
    this.showCreateModal = true;
    this.createDialog().nativeElement.showModal();
  }

  closeCreate(): void {
    this.createDialog().nativeElement.close();
  }

  selectRequest(req: any): void {
    this.selectedRequest = req;
    this.activeTab = 'details';
    this.stepFailed = false;
    this.comments = [];
    this.submitterPhotoUrl = '';
    if (req.requestedByProfileId) {
      this.profileService.getAvatarUrl(req.requestedByProfileId).subscribe({
        next: (url) => {
          if (this.selectedRequest === req) this.submitterPhotoUrl = url;
        },
        error: () => {},
      });
    }
    for (const asset of req.digitalAssets ?? []) {
      if (asset.url && !this.photoUrls[asset.digitalAssetId]) {
        this.maintenanceService.getPhoto(asset.url).subscribe({
          next: (blob) => (this.photoUrls[asset.digitalAssetId] = URL.createObjectURL(blob)),
          error: () => {},
        });
      }
    }
    if (req.maintenanceRequestId) {
      this.maintenanceService.getComments(req.maintenanceRequestId).subscribe({
        next: (data: any) => {
          this.comments = Array.isArray(data) ? data : data?.comments || [];
        },
        error: () => {},
      });
    }
  }

  addComment(): void {
    const body = this.commentControl.value;
    if (!body || !this.selectedRequest?.maintenanceRequestId) return;
    this.maintenanceService.addComment(this.selectedRequest.maintenanceRequestId, body).subscribe({
      next: () => {
        this.comments.push({ body, createdBy: 'You', createdOn: new Date().toISOString() });
        this.commentControl.reset();
      },
      error: () => {},
    });
  }

  submitRequest(): void {
    if (this.createForm.invalid) return;
    this.maintenanceService.createMaintenanceRequest(this.createForm.value).subscribe({
      next: () => {
        this.closeCreate();
        this.createForm.reset();
        this.loadRequests();
      },
      error: () => {},
    });
  }

  getStatusLabel(status: any): string {
    const numMap: Record<number, string> = {
      0: 'New',
      1: 'Received',
      2: 'Started',
      3: 'Completed',
    };
    if (typeof status === 'number') return numMap[status] || 'New';
    return status || 'New';
  }

  getStatusTone(status: any): BadgeTone {
    const label = this.getStatusLabel(status).toLowerCase();
    switch (label) {
      case 'new':
      case 'created':
        return 'warning';
      case 'received':
        return 'neutral';
      case 'started':
      case 'inprogress':
        return 'info';
      case 'completed':
      case 'complete':
      case 'done':
        return 'success';
      default:
        return 'neutral';
    }
  }
}
