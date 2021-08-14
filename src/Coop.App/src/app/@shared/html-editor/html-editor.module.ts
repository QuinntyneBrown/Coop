import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlEditorComponent } from './html-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';



@NgModule({
  declarations: [
    HtmlEditorComponent
  ],
  exports: [
    HtmlEditorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSummernoteModule
  ]
})
export class HtmlEditorModule { }
