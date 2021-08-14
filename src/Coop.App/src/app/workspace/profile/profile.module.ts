import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { BentoBoxModule } from '@shared';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentCardModule } from '@shared/document-card/document-card.module';
import { CreateAMaintenaceRequestDialogModule } from '@shared/create-a-maintenace-request-dialog/create-a-maintenace-request-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MaintenanceRequestCardModule } from '@shared/maintenance-request-card/maintenance-request-card.module';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { IdModule } from '@shared/id/id.module';
import { MatIconModule } from '@angular/material/icon';
import { MessengerModule } from '@shared/messenger/messenger.module';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileListComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    BentoBoxModule,
    DigitalAssetUploadModule,
    MatButtonModule,
    ReactiveFormsModule,
    DocumentCardModule,
    CreateAMaintenaceRequestDialogModule,
    MatDialogModule,
    MaintenanceRequestCardModule,
    IdModule,
    MatButtonModule,
    MatIconModule,
    MessengerModule
  ]
})
export class ProfileModule { }
