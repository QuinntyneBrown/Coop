import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { BentoBoxModule } from '@shared';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentCardModule } from '@shared/document-card/document-card.module';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    BentoBoxModule,
    DigitalAssetUploadModule,
    MatButtonModule,
    ReactiveFormsModule,
    DocumentCardModule
  ]
})
export class ProfileModule { }
