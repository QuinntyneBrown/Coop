// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EntityDataSource } from '@shared';
import { StaffMemberService, StaffMember } from '@api';

@Component({
  selector: 'app-staff-member-list',
  templateUrl: './staff-member-list.component.html',
  styleUrls: ['./staff-member-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffMemberListComponent implements OnDestroy {

  private readonly _destroyed$: Subject<void> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private readonly _pageIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _pageSize$: BehaviorSubject<number> = new BehaviorSubject(5);
  private readonly _dataSource: EntityDataSource<StaffMember> = new EntityDataSource(this._staffMemberService);

  public readonly vm$: Observable<{
    dataSource: EntityDataSource<StaffMember>,
    columnsToDisplay: string[],
    length$: Observable<number>,
    pageNumber: number,
    pageSize: number
  }> = combineLatest([this._pageIndex$, this._pageSize$ ])
  .pipe(
    switchMap(([pageIndex,pageSize]) => combineLatest([
      of([
        'firstname',
        'lastname',
        'edit',
        'delete'
      ]),
      of(pageIndex),
      of(pageSize)
    ])
    .pipe(
      map(([columnsToDisplay, pageNumber, pageSize]) => {
        this._dataSource.getPage({ pageIndex, pageSize });
        return {
          dataSource: this._dataSource,
          columnsToDisplay,
          length$: this._dataSource.length$,
          pageSize,
          pageNumber
        }
      })
    ))
  );

  constructor(
    private readonly _staffMemberService: StaffMemberService,
    private readonly _dialog: MatDialog,
  ) { }

  public edit(staffMember: StaffMember) {

  }

  public create() {

  }

  public delete(staffMember: StaffMember) {
    this._staffMemberService.remove({ staffMember }).pipe(
      takeUntil(this._destroyed$)
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

