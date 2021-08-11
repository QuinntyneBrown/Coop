import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AggregatePrivilege } from '@api';

@Component({
  selector: 'app-aggregate-privilege',
  templateUrl: './aggregate-privilege.component.html',
  styleUrls: ['./aggregate-privilege.component.scss']
})
export class AggregatePrivilegeComponent  {

  @Input("aggregatePrivilege") public aggregatePrivilege!: AggregatePrivilege;

  @Input("accessRights") public accessRights: number[];

  @Output() public add: EventEmitter<any> = new EventEmitter();

  @Output() public remove: EventEmitter<any> = new EventEmitter();

  private _lookUp = {0: "Full", 1: "Read", 2: "Write", 3: "Create", 4: "Delete" }

  public translateAccessRight = (accessRight: number) => this._lookUp[accessRight];

  public hasAccessRight(accessRight: number): boolean {
    return this.aggregatePrivilege.privileges.filter(x => x.accessRight == accessRight).length > 0;
  }

  public handleAccessRightClick(accessRight: number) {
    const aggregatePrivilege = this.aggregatePrivilege.privileges.filter(x => x.accessRight == accessRight)[0];
    return this.hasAccessRight(accessRight)
    ? this.remove.emit(aggregatePrivilege)
    : this.add.emit({accessRight, aggregate: this.aggregatePrivilege.aggregate});
  }
}
