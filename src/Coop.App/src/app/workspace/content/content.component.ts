import { Component, OnInit } from '@angular/core';
import { JsonContentService } from '@api';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) { }
}
