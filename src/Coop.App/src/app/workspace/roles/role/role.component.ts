import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Aggregate, Privilege, PrivilegeService, Role, RoleService } from '@api';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {

  public readonly addAction: Subject<{ privilege: Privilege, role: Role }> = new Subject();

  public readonly removeAction: Subject<Privilege> = new Subject();

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _roleService: RoleService,
    private readonly _privilegeService: PrivilegeService
  ) { }

  public aggregates: string[] = [
    "BoardMember",
    "ByLaw",
    "DigitalAsset",
    "MaintenanceRequest",
    "Member",
    "Notice",
    "Privilege",
    "Role",
    "StaffMember",
    "User",
    Aggregate.Report,
    Aggregate.Message,
    Aggregate.JsonContent,
    Aggregate.Theme

  ];

  public accessRights: number[] = [0,1,2,3,4];

  public vm$ = merge(
    this.addAction.pipe(
      switchMap(options => {
        Object.assign(options.privilege, { roleId: options.role.roleId });
        return this._privilegeService.create({ privilege: options.privilege })
      })
    ),
    this.removeAction.pipe(
      switchMap( privilege => this._privilegeService.remove({ privilege }))
    )
  )
  .pipe(
    startWith(true),
    switchMap(_ => this._activatedRoute.paramMap),
    map(paramMap => paramMap.get("id")),
    switchMap(roleId => this._roleService.getById({ roleId })),
    map(role => {
      for(var i = 0; i < this.aggregates.length; i++) {
        if(role.privileges.filter(x => x.aggregate == this.aggregates[i]).length < 1) {
          role.aggregatePrivileges.push({
            aggregate: this.aggregates[i],
            privileges: []
          });
        }
      }
      return role;
    }),
    map(role => ({ role }))
    );
}
