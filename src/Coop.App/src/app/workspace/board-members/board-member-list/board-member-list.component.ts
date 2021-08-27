import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { EntityDataSource } from '@shared';
import { BoardMemberService, BoardMember, ProfileService } from '@api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-member-list',
  templateUrl: './board-member-list.component.html',
  styleUrls: ['./board-member-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardMemberListComponent implements OnDestroy {

  private readonly _destroyed$: Subject<void> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private readonly _pageIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _pageSize$: BehaviorSubject<number> = new BehaviorSubject(5);
  private readonly _dataSource: EntityDataSource<BoardMember> = new EntityDataSource(this._boardMemberService);
  private readonly _refresh: Subject<void> = new Subject();

  public readonly vm$: Observable<{
    dataSource: EntityDataSource<BoardMember>,
    columnsToDisplay: string[],
    length$: Observable<number>,
    pageNumber: number,
    pageSize: number
  }> = combineLatest([this._pageIndex$, this._pageSize$ ])
  .pipe(
    switchMap(([pageIndex,pageSize]) => combineLatest([
      of([
        'title',
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
    private readonly _boardMemberService: BoardMemberService,
    private readonly _profileService: ProfileService,
    private readonly _router: Router
  ) { }

  public edit(boardMember: BoardMember) {
    this._router.navigate(['/','workspace','board-members','edit', boardMember.profileId]);
  }

  public create() {
    this._router.navigate(['/','workspace','board-members','create']);
  }

  public delete(boardMember: BoardMember) {
    this._profileService.remove({ profile: boardMember }).pipe(
      takeUntil(this._destroyed$),
      tap(x => this._refresh.next())
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
