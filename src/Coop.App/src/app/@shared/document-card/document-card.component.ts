import { Component, Inject, Input } from '@angular/core';
import { Document } from '@api';
import { baseUrl } from '@core';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.scss']
})
export class DocumentCardComponent {

  @Input() public document!: Document;

  constructor(
    @Inject(baseUrl) public readonly baseUrl: string
  ) {

  }
}
