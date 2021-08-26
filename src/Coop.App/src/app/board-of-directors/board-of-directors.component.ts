import { Component, Inject } from '@angular/core';
import { BoardMemberService, JsonContentTypeName, JsonContentTypeService } from '@api';
import { baseUrl } from '@core';
import { combineLatest, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-board-of-directors',
  templateUrl: './board-of-directors.component.html',
  styleUrls: ['./board-of-directors.component.scss']
})
export class BoardOfDirectorsComponent {

  public vm$ = combineLatest([this._boardMemberService.get(),this._jsonContentTypeService.getByName({ name: JsonContentTypeName.BoardOfDirectors })])
  .pipe(
    map(([boardMembers, jsonContentType]) => ({ boardMembers, text: jsonContentType.jsonContent.json.text }))
  );

  constructor(
    private readonly _boardMemberService: BoardMemberService,
    private readonly _jsonContentTypeService: JsonContentTypeService,
    @Inject(baseUrl) public readonly baseUrl: string
  ) {

  }

}
