import { Component, Inject } from '@angular/core';
import { JsonContentName, JsonContentService } from '@api';
import { baseUrl } from '@core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-board-of-directors',
  templateUrl: './board-of-directors.component.html',
  styleUrls: ['./board-of-directors.component.scss']
})
export class BoardOfDirectorsComponent {

  public vm$ = this._jsonContentService.getByName({ name: JsonContentName.BoardOfDirectors })
  .pipe(
    map(jsonContent => ({
      boardMembers: jsonContent.json.boardMembers,
      heading: jsonContent.json.heading,
      subheading: jsonContent.json.subheading
    }))
  );

  constructor(
    private readonly _jsonContentService: JsonContentService,
    @Inject(baseUrl) public readonly baseUrl: string
  ) { }

}
