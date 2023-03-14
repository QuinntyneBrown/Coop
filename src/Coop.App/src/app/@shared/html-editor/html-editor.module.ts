// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

