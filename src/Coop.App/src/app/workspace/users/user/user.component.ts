import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService, RoleService, User, UserService } from '@api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  public roles: string[] = [
    "Member","Staff","BoardMember","SystemAdministrator"
  ];

  public profileTypes: any[] = [
    { name:"Member", value: 0},
    { name:"Board Member", value: 1},
    { name:"Staff Member", value: 2}
  ];

  public userForm = new FormGroup({
    username: new FormControl(null,[Validators.required]),
    password: new FormControl(null,[Validators.required])
  });

  public avatarControl = new FormControl(null, []);

  public profileTypeControl = new FormControl(null,[]);

  public roleControl = new FormControl(null,[]);

  public firstnameControl = new FormControl(null, []);

  public lastnameControl = new FormControl(null, []);

  public has(user: User, role:string): boolean {
    return user?.roles.filter(x => x.name == role).length > 0;
  }

  public handleRoleClick(user: User, role:string) {

  }

  public vm$: Observable<any> = this._activatedRoute
  .paramMap
  .pipe(
    map(paramMap => paramMap.get("id")),
    switchMap(userId => userId ? this._userService.getById({ userId }): of(null)),
    switchMap(user => user ? this._profileService.getById({ profileId: user.defaultProfileId }).pipe(
      map(profile => {
        return Object.assign(user, { profile })
      })
    ): of(null)),
    map(user => {

      const form = new FormGroup({
        username: new FormControl(user?.username,[Validators.required])
      });

      return {
        user,
        form,
        formControl: new FormControl(user?.profile?.avatarDigitalAssetId,[])
      };
    })
  );

  constructor(
    private readonly _userService: UserService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _profileService: ProfileService,
    private readonly _roleService: RoleService,
    private readonly _router: Router
  ) { }

  public roles$ = this._roleService.get();

  public tryToSave() {
    let user = this.userForm.value;
    user.roles = [{ roleId: this.roleControl.value}];

    user.defaultProfile = {
      profileType: this.profileTypeControl.value,
      avatarDigitalAssetId: this.avatarControl.value,
      firstname: this.firstnameControl.value,
      lastname: this.lastnameControl.value
    };

    this._userService.create({ user })
    .subscribe(_ => this._router.navigate(['/','workspace','users']));
  }
}
