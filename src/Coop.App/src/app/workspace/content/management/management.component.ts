import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JsonContentName, JsonContentService } from '@api';
import { ImageHeadingSubheadingPopupComponent } from '@shared/image-heading-subheading-popup/image-heading-subheading-popup.component';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';


const name = JsonContentName.ManagementStaff;

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnDestroy {

  private readonly _destroyed$ = new Subject();

  public vm$ = this._jsonContentService.getByName({ name })
  .pipe(
    map(jsonContent => {

      const managementStaff = jsonContent?.json?.managementStaff || [];

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
        managementStaff,
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
          vm.managementStaff.push(dto);
        }
      })
    )
    .subscribe();
  }

  drop(managementStaff: any, event: CdkDragDrop<any[]>) {
    moveItemInArray(managementStaff, event.previousIndex, event.currentIndex);
  }

  public save(vm) {
    let jsonContent = vm.form.value;

    jsonContent.json.managementStaff = vm.managementStaff;

    const obs$ = jsonContent?.jsonContentId
    ? this._jsonContentService.update({ jsonContent})
    : this._jsonContentService.create({ jsonContent });

    obs$
    .pipe(
      takeUntil(this._destroyed$)
    )
    .subscribe();
  }

  public remove(managementStaff: any[], index: number) {
    managementStaff.splice(index, 1);
  }

  public edit(managementStaff, member, index) {
    this._dialog.open(ImageHeadingSubheadingPopupComponent, {
      autoFocus: false,
      data: member
    })
    .afterClosed()
    .pipe(
      takeUntil(this._destroyed$),
      tap(dto => {
        if(dto) {
          managementStaff[index] = dto;
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
