import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAndImagesComponent } from './text-and-images.component';



@NgModule({
  declarations: [
    TextAndImagesComponent
  ],
  exports: [
    TextAndImagesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TextAndImagesModule { }
