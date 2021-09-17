import { Component, Inject } from '@angular/core';
import { BoardMemberService, JsonContentName, JsonContentService } from '@api';
import { baseUrl } from '@core';
import { combineLatest, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-board-of-directors',
  templateUrl: './board-of-directors.component.html',
  styleUrls: ['./board-of-directors.component.scss']
})
export class BoardOfDirectorsComponent {

  public vm$ = combineLatest([this._boardMemberService.get(),this._jsonContentService.getByName({ name: JsonContentName.BoardOfDirectors })])
  .pipe(
    map(([boardMembers, jsonContent]) => ({
      boardMembers,
      heading: jsonContent.json.heading,
      subHeading: jsonContent.json.subHeading
    }))
  );

  constructor(
    private readonly _boardMemberService: BoardMemberService,
    private readonly _jsonContentService: JsonContentService,
    @Inject(baseUrl) public readonly baseUrl: string
  ) {

  }

}
