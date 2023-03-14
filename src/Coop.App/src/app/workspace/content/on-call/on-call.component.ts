// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JsonContentName, JsonContentService } from '@api';
import { ImageHeadingSubheadingPopupComponent } from '@shared/image-heading-subheading-popup/image-heading-subheading-popup.component';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';


const name = JsonContentName.OnCall;

@Component({
  selector: 'app-on-call',
  templateUrl: './on-call.component.html',
  styleUrls: ['./on-call.component.scss']
})
export class OnCallComponent implements OnDestroy  {

  private readonly _destroyed$ = new Subject();

  public vm$ = this._jsonContentService.getByName({ name })
  .pipe(
    map(jsonContent => {

      const onCallStaff = jsonContent?.json?.onCallStaff || [];

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
        onCallStaff,
      }
    })
  )

  constructor(
    private readonly _jsonContentService: JsonContentService,
    private readonly _dialog: MatDialog
  ) { }

  public add(vm) {
    this._dialog.open(ImageHeadingSubheadingPopupComponent, {
      autoFocus: false
    })
    .afterClosed()
    .pipe(
      takeUntil(this._destroyed$),
      tap(dto => {
        if(dto) {
          vm.onCallStaff.push(dto);
        }
      })
    )
    .subscribe();
  }

  drop(onCallStaff: any, event: CdkDragDrop<any[]>) {
    moveItemInArray(onCallStaff, event.previousIndex, event.currentIndex);
  }

  public save(vm) {
    let jsonContent = vm.form.value;

    jsonContent.json.onCallStaff = vm.onCallStaff;

    const obs$ = jsonContent?.jsonContentId
    ? this._jsonContentService.update({ jsonContent})
    : this._jsonContentService.create({ jsonContent });

    obs$
    .pipe(
      takeUntil(this._destroyed$)
    )
    .subscribe();
  }

  public remove(onCallStaff: any[], index: number) {
    onCallStaff.splice(index, 1);
  }

  public edit(onCallStaff, member, index) {
    this._dialog.open(ImageHeadingSubheadingPopupComponent, {
      autoFocus: false,
      data: member
    })
    .afterClosed()
    .pipe(
      takeUntil(this._destroyed$),
      tap(dto => {
        if(dto) {
          onCallStaff[index] = dto;
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

