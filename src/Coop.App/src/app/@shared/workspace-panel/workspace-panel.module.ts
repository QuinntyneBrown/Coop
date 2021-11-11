import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspacePanelComponent } from './workspace-panel.component';



@NgModule({
  declarations: [
    WorkspacePanelComponent
  ],
  exports: [
    WorkspacePanelComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WorkspacePanelModule { }
