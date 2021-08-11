import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    WorkspaceComponent
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    MatSidenavModule,
    RouterModule
  ]
})
export class WorkspaceModule { }
