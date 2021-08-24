import { Component, Inject } from '@angular/core';
import { BoardMemberService, JsonContentTypeService } from '@api';
import { baseUrl } from '@core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-board-of-directors',
  templateUrl: './board-of-directors.component.html',
  styleUrls: ['./board-of-directors.component.scss']
})
export class BoardOfDirectorsComponent {

  public vm$ = this._boardMemberService.get()
  .pipe(
    map(boardMembers => ({ boardMembers }))
  );

  constructor(
    private readonly _boardMemberService: BoardMemberService,
    private readonly _jsonContentTypeService: JsonContentTypeService,
    @Inject(baseUrl) public readonly baseUrl: string
  ) {

  }

}
