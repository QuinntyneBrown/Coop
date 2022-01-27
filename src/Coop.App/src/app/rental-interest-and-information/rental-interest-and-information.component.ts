import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-rental-interest-and-information',
  templateUrl: './rental-interest-and-information.component.html',
  styleUrls: ['./rental-interest-and-information.component.scss']
})
export class RentalInterestAndInformationComponent  {

  readonly vm$ = this._jsonContentService.getByName({ name: JsonContentName.RentalInterestAndInformation })
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
