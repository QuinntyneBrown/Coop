import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AlertBodyComponent,
  AlertComponent,
  ButtonComponent,
  DialogBodyComponent,
  DialogComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogIconComponent,
  DialogPanelComponent,
  DialogTitleComponent,
  IconComponent,
  PublishBarActionsComponent,
  PublishBarComponent as LibPublishBarComponent,
  PublishBarTextComponent,
} from 'components';
import { PreviewTokenService } from '../../../core/services/preview-token.service';
import { SiteContentService } from '../../../core/services/site-content.service';

/**
 * The publish bar of the Website screens (L2-REQ-121 AC6 to AC8, ADR 0018),
 * drawn in docs/mocks/pages/admin-website/ with its dialogs in
 * docs/mocks/dialogs/admin-publish-confirm/ and admin-discard-confirm/: says
 * whether there are unpublished changes, opens the public site in preview
 * mode, and publishes or discards the draft after asking.
 */
@Component({
  selector: 'app-publish-bar',
  standalone: true,
  imports: [
    LibPublishBarComponent,
    PublishBarTextComponent,
    PublishBarActionsComponent,
    ButtonComponent,
    IconComponent,
    AlertComponent,
    AlertBodyComponent,
    DialogComponent,
    DialogPanelComponent,
    DialogHeaderComponent,
    DialogIconComponent,
    DialogTitleComponent,
    DialogBodyComponent,
    DialogFooterComponent,
  ],
  templateUrl: './publish-bar.component.html',
  styleUrl: './publish-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishBarComponent implements OnInit {
  private readonly siteContent = inject(SiteContentService);
  private readonly previewToken = inject(PreviewTokenService);
  private readonly publishDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'publishDialog',
    { read: ElementRef },
  );
  private readonly discardDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'discardDialog',
    { read: ElementRef },
  );

  readonly hasDraft = this.siteContent.hasDraft;
  readonly previewAddress = () => this.previewToken.address();

  readonly notice = signal('');
  readonly busy = signal(false);
  readonly publishFailed = signal(false);
  readonly discardFailed = signal(false);

  /** The draft was published. */
  readonly published = output<void>();
  /** The draft was discarded; the screen should reload the published content. */
  readonly discarded = output<void>();

  ngOnInit(): void {
    this.previewToken.refresh();
  }

  openPublish(): void {
    this.publishFailed.set(false);
    this.notice.set('');
    this.publishDialog()?.nativeElement.showModal();
  }

  closePublish(): void {
    this.publishDialog()?.nativeElement.close();
  }

  publish(): void {
    this.busy.set(true);
    this.publishFailed.set(false);
    this.siteContent.publish().subscribe({
      next: () => {
        this.busy.set(false);
        this.closePublish();
        this.notice.set('Your changes are now on the website.');
        this.published.emit();
      },
      error: () => {
        this.busy.set(false);
        this.publishFailed.set(true);
      },
    });
  }

  openDiscard(): void {
    this.discardFailed.set(false);
    this.notice.set('');
    this.discardDialog()?.nativeElement.showModal();
  }

  closeDiscard(): void {
    this.discardDialog()?.nativeElement.close();
  }

  discard(): void {
    this.busy.set(true);
    this.discardFailed.set(false);
    this.siteContent.discard().subscribe({
      next: () => {
        this.busy.set(false);
        this.closeDiscard();
        this.notice.set('Your unpublished changes were discarded. The website is unchanged.');
        this.discarded.emit();
      },
      error: () => {
        this.busy.set(false);
        this.discardFailed.set(true);
      },
    });
  }
}
