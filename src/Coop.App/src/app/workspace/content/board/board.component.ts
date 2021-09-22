import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JsonContentName, JsonContentService } from '@api';
import { ImageHeadingSubheadingPopupComponent } from '@shared/image-heading-subheading-popup/image-heading-subheading-popup.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';


const name = JsonContentName.BoardOfDirectors;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnDestroy {

  private readonly _destroyed$ = new Subject();

  public vm$ = this._jsonContentService.getByName({ name })
  .pipe(
    map(jsonContent => {

      const boardMembers$: BehaviorSubject<any[]> = new BehaviorSubject(jsonContent?.json?.boardMembers || []);

      const form = new FormGroup({
        jsonContentId: new FormControl(jsonContent?.jsonContentId,[Validators.required]),
        name: new FormControl(name, [Validators.required]),
        json: new FormGroup({
          heading: new FormControl(jsonContent?.json?.heading, [Validators.required]),
          subheading: new FormControl(jsonContent?.json?.subheading, [Validators.required])
        })
      });

      return {
        form,
        boardMembers: boardMembers$.value,
        boardMembers$
      }
    })
  )

  constructor(
    private readonly _jsonContentService: JsonContentService,
    private readonly _dialog: MatDialog
  ) { }

  public addBoardMember(vm) {
    this._dialog.open(ImageHeadingSubheadingPopupComponent, {
      autoFocus: false
    })
    .afterClosed()
    .pipe(
      takeUntil(this._destroyed$),
      tap(dto => {
        if(dto) {
          vm.boardMembers.push(dto);
        }
      })
    )
    .subscribe();
  }

  drop(boardMembers: any, event: CdkDragDrop<any[]>) {
    moveItemInArray(boardMembers, event.previousIndex, event.currentIndex);
  }

  public removeBoardMember() {

  }

  public save(vm) {
    let jsonContent = vm.form.value;

    jsonContent.json.boardMembers = vm.boardMembers;

    const obs$ = jsonContent?.jsonContentId
    ? this._jsonContentService.update({ jsonContent})
    : this._jsonContentService.create({ jsonContent });

    obs$
    .pipe(
      takeUntil(this._destroyed$)
    )
    .subscribe();
  }

  public remove(boardMembers: any[], index: number) {
    boardMembers.splice(index, 1);
  }

  public edit(boardMembers, boardMember, index) {
    this._dialog.open(ImageHeadingSubheadingPopupComponent, {
      autoFocus: false,
      data: boardMember
    })
    .afterClosed()
    .pipe(
      takeUntil(this._destroyed$),
      tap(dto => {
        if(dto) {
          boardMembers[index] = dto;
        }
      })
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
