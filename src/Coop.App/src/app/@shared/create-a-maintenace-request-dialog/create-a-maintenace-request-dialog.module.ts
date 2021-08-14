import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAMaintenaceRequestDialogComponent } from './create-a-maintenace-request-dialog.component';
import { MaintenanceRequestEditorModule } from '@shared/maintenance-request-editor/maintenance-request-editor.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    CreateAMaintenaceRequestDialogComponent
  ],
  exports: [
    CreateAMaintenaceRequestDialogComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRequestEditorModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class CreateAMaintenaceRequestDialogModule { }
