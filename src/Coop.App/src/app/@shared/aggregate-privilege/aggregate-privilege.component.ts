// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AggregatePrivilege } from '@api';

@Component({
  selector: 'app-aggregate-privilege',
  templateUrl: './aggregate-privilege.component.html',
  styleUrls: ['./aggregate-privilege.component.scss']
})
export class AggregatePrivilegeComponent  {

  @Input("aggregatePrivilege") aggregatePrivilege!: AggregatePrivilege;

  @Input("accessRights") accessRights: number[];

  @Output() add: EventEmitter<any> = new EventEmitter();

  @Output() remove: EventEmitter<any> = new EventEmitter();

  private readonly _lookUp = {0: "Full", 1: "Read", 2: "Write", 3: "Create", 4: "Delete" }

  translateAccessRight = (accessRight: number) => this._lookUp[accessRight];

  hasAccessRight(accessRight: number): boolean {
    return this.aggregatePrivilege.privileges.filter(x => x.accessRight == accessRight).length > 0;
  }

  handleAccessRightClick(accessRight: number) {
    const aggregatePrivilege = this.aggregatePrivilege.privileges.filter(x => x.accessRight == accessRight)[0];
    return this.hasAccessRight(accessRight)
    ? this.remove.emit(aggregatePrivilege)
    : this.add.emit({accessRight, aggregate: this.aggregatePrivilege.aggregate});
  }
}

