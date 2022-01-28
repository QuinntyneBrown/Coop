import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-and-images',
  templateUrl: './text-and-images.component.html',
  styleUrls: ['./text-and-images.component.scss']
})
export class TextAndImagesComponent {

  @Input() imageSrcs: string[] = [];

  @Input("text") private _text: string;

  get text() {
    return this._text;
  }
}
