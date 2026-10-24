import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ButtonComponent,
  IconComponent,
  PreviewPaneComponent as LibPreviewPaneComponent,
  PreviewPaneFrameComponent,
  PreviewPaneHeaderComponent,
  PreviewPaneNoteComponent,
  PreviewPaneTitleComponent,
} from 'components';
import { PreviewTokenService } from '../../../core/services/preview-token.service';

/**
 * The page editor's preview pane (L2-REQ-125 AC4, ADR 0019): the public site
 * in a frame, in preview mode, scrolled to the section being edited. The
 * admin's own sign-in never reaches the frame; only the preview token does.
 */
@Component({
  selector: 'app-preview-pane',
  standalone: true,
  imports: [
    LibPreviewPaneComponent,
    PreviewPaneHeaderComponent,
    PreviewPaneTitleComponent,
    PreviewPaneNoteComponent,
    PreviewPaneFrameComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './preview-pane.component.html',
  styleUrl: './preview-pane.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewPaneComponent implements OnInit {
  private readonly previewToken = inject(PreviewTokenService);
  private readonly sanitizer = inject(DomSanitizer);

  /** The id of the section the frame scrolls to. */
  readonly anchor = input('');
  /** The public page shown: the home page unless a website page's address is given. */
  readonly path = input('/');

  /** Counts the reloads, so a save shows the new draft in the frame. */
  private readonly reloads = signal(0);

  readonly address = computed(() => this.previewToken.address(this.anchor(), this.path()));

  /**
   * The frame's source: the same address with a reload count, so a save shows the new draft even
   * when nothing else changed. It is built from the public site's fixed address and the token only.
   */
  readonly frameSource = computed(() => {
    const count = this.reloads();
    const address = this.address();
    const [base, fragment] = address.split('#');
    const source = count > 0 && base.includes('?') ? `${base}&r=${count}` : base;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      fragment ? `${source}#${fragment}` : source,
    );
  });

  ngOnInit(): void {
    this.previewToken.refresh();
  }

  /** Shows the draft as last saved (L2-REQ-125 AC4). */
  reload(): void {
    this.previewToken.refresh();
    this.reloads.update((n) => n + 1);
  }
}
