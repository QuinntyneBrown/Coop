import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import {
  AlertActionsComponent,
  AlertBodyComponent,
  AlertComponent,
  ButtonComponent,
  CardComponent,
  IconComponent,
} from 'components';
import { PublishBarComponent } from './publish-bar/publish-bar.component';
import { SiteTreeComponent } from './site-tree/site-tree.component';

/**
 * The Website area landing at /website (L2-REQ-118, ADR 0020), drawn in
 * docs/mocks/pages/admin-website/: the publish bar and the site tree as
 * cards. Everything a visitor can see is reached from here.
 */
@Component({
  selector: 'app-website',
  standalone: true,
  imports: [
    SiteTreeComponent,
    PublishBarComponent,
    AlertActionsComponent,
    AlertBodyComponent,
    AlertComponent,
    ButtonComponent,
    CardComponent,
    IconComponent,
  ],
  templateUrl: './website.component.html',
  styleUrl: './website.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteComponent {
  private readonly tree = viewChild.required(SiteTreeComponent);

  readonly failed = signal(false);

  retry(): void {
    this.tree().load();
  }
}
