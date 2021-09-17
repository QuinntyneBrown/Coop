import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() public heading: string = "OWN Housing Co-operative";
  @Input() public subHeading: string = "Integrity, Strength, Action";

  public vm$ = this._jsonContentService.getByName({ name: JsonContentName.Hero })
  .pipe(
    map(jsonContent => jsonContent.json)
  );

  constructor(
    private readonly _router: Router,
    private readonly _jsonContentService: JsonContentService
  ) {

  }

  public headerClick() {
    this._router.navigate(["/"]);
  }

  public baseUrl = environment.baseUrl;

}
