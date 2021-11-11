import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WorkspacePanelModule } from '@shared/workspace-panel/workspace-panel.module';


@NgModule({
  declarations: [
    WorkspaceComponent
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    MatSidenavModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    WorkspacePanelModule
  ]
})
export class WorkspaceModule { }
