import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-and-images',
  templateUrl: './text-and-images.component.html',
  styleUrls: ['./text-and-images.component.scss']
})
export class TextAndImagesComponent {

  @Input() public imageSrcs: string[] = [];

  @Input("text") private _text: string;

  public get text() {
    return this._text;
  }
}
