import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCardComponent } from './document-card.component';



@NgModule({
  declarations: [
    DocumentCardComponent
  ],
  exports: [
    DocumentCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DocumentCardModule { }
