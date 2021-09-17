import { Component, OnInit } from '@angular/core';
import { JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-rental-interest-and-information',
  templateUrl: './rental-interest-and-information.component.html',
  styleUrls: ['./rental-interest-and-information.component.scss']
})
export class RentalInterestAndInformationComponent  {

  public vm$ = this._jsonContentService.getByName({ name: JsonContentName.RentalInterestAndInformation })
  .pipe(
    map(jsonContent => jsonContent.json)
  );

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) {

  }
}
