import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent, SkipLinkComponent, TabBarComponent } from 'components';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    IconComponent,
    SidebarComponent,
    SkipLinkComponent,
    TabBarComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LayoutComponent {}
