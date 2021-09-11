import { Component, OnInit } from '@angular/core';
import { BoardMemberService, JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  public vm$ = this._jsonContentService.getByName({ name: JsonContentName.Landing })
  .pipe(
    map(jsonContent => ({ json: jsonContent.json }))
  )

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) { }


}
