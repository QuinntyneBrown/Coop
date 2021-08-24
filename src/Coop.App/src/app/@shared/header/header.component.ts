import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JsonContentTypeService } from '@api/services/json-content-type.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() public heading: string = "OWN Housing Co-operative";
  @Input() public subHeading: string = "Integrity, Strength, Action";

  public vm$ = this._jsonContentTypeService.getByName({ name: 'Hero'})
  .pipe(
    map(jsonContentType => jsonContentType.jsonContent.json)
  );

  constructor(
    private readonly _router: Router,
    private readonly _jsonContentTypeService: JsonContentTypeService
  ) {

  }

  public headerClick() {
    this._router.navigate(["/"]);
  }
}
