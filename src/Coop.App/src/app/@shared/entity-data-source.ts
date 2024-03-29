// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CollectionViewer } from "@angular/cdk/collections";
import { DataSource } from "@angular/cdk/table";
import { IPagableService } from "@core/ipagable-service";
import { replace } from "@core/replace";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

export class EntityDataSource<T> implements DataSource<T> {
    private readonly _disconnected$: Subject<void> = new Subject();

    readonly entities$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    
    readonly length$: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(private _pagableService: IPagableService<T>) { }

    connect(collectionViewer: CollectionViewer): Observable<T[] | readonly T[]> {
        return this.entities$.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this._disconnected$.next();
        this._disconnected$.complete();
    }

    update(value: T) {
        this.entities$
        .next(replace({ items: this.entities$.value, value, key: this._pagableService.uniqueIdentifierName }));
    }

    getPage(options: { pageIndex: number, pageSize: number }) {
        this._pagableService.getPage(options)
        .pipe(
            takeUntil(this._disconnected$),
            tap(x => {
                this.length$.next(x.length);
                this.entities$.next(x.entities)
            })
        ).subscribe();
    }
}



