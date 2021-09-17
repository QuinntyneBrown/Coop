import { Component } from '@angular/core';
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
    map(jsonContent => jsonContent.json)
  );

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) {

  }

}
