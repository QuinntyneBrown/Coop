import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplashRoutingModule } from './splash-routing.module';
import { SplashComponent } from './splash.component';
import { COMMON_FORMS_MODULES } from '@shared';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';


@NgModule({
  declarations: [
    SplashComponent
  ],
  imports: [
    CommonModule,
    COMMON_FORMS_MODULES,
    SplashRoutingModule,
    HtmlEditorModule
  ]
})
export class SplashModule { }
