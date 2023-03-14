// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardMemberService } from '@api';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

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
    switchMap(boardMemberId => boardMemberId ? this._boardMemberService.getById({ boardMemberId }) : of(null)),
    map(boardMember => {
      const form = new FormGroup({
        avatarDigitalAssetId: new FormControl(boardMember?.avatarDigitalAssetId, [Validators.required]),
        profileId: new FormControl(boardMember?.profileId ? boardMember?.profileId : undefined, [Validators.required]),
        boardTitle: new FormControl(boardMember?.boardTitle, [Validators.required]),
        firstname: new FormControl(boardMember?.firstname, [Validators.required]),
        lastname: new FormControl(boardMember?.lastname, [Validators.required])
      });

      return {
        boardMember,
        form
      }
    })
  )

  constructor(
    private readonly _boardMemberService: BoardMemberService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router
  ) { }

  public cancel() {
    this._router.navigate(['/','workspace','board-members'])
  }

  public save(vm) {
    const boardMember = vm.form.value;

    const obs$ = boardMember.profileId
    ? this._boardMemberService.update({ boardMember})
    : this._boardMemberService.create({ boardMember});

    obs$
    .pipe(tap(_ => this._router.navigate(['/','workspace','board-members'])))
    .subscribe();
  }
}

