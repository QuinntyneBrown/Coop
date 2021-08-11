import { Component, OnInit } from '@angular/core';
import { BoardMemberService } from '@api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  public vm$ = this._boardMemberService.get()
  .pipe(
    map(boardMembers => ({ boardMembers }))
  )

  constructor(
    private readonly _boardMemberService: BoardMemberService
  ) { }


}
