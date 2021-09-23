import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  public vm$ = this._jsonContentService.getByName({ name: JsonContentName.ContactUs })
  .pipe(
    map(jsonContent => {
      return  {
        body: this._domSanitizer.bypassSecurityTrustHtml(jsonContent.json.body),
        heading: jsonContent.json.heading
      }
    })
  );

  constructor(
    private readonly _jsonContentService: JsonContentService,
    private readonly _domSanitizer: DomSanitizer
  ) {

  }

}
