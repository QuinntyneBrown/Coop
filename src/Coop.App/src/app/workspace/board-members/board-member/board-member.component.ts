import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardMemberService } from '@api';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-board-member',
  templateUrl: './board-member.component.html',
  styleUrls: ['./board-member.component.scss']
})
export class BoardMemberComponent {

  public vm$ = this._activatedRoute
  .paramMap
  .pipe(
    map(paramMap => paramMap.get("id")),
    switchMap(boardMemberId => this._boardMemberService.getById({ boardMemberId })),
    map(baordMember => ({ baordMember }))
  )

  constructor(
    private readonly _boardMemberService: BoardMemberService,
    private readonly _activatedRoute: ActivatedRoute
  ) {

  }

}
