import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateMaintenanceRequest, MaintenanceRequestService, ProfileService } from '@api';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-maintenance-request',
  templateUrl: './create-maintenance-request.component.html',
  styleUrls: ['./create-maintenance-request.component.scss']
})
export class CreateMaintenanceRequestComponent {

  public vm$ = this._profileService.getCurrent()
  .pipe(
    map(profile => {

      console.log(profile);

      alert(profile.profileId);

      let fullname = `${profile.firstname} ${profile.lastname}`;

      const form = new FormGroup({
        requestedByName: new FormControl(fullname,[Validators.required]),
        requestedByProfileId: new FormControl(profile.profileId,[Validators.required]),
        address: new FormControl(null,[Validators.required]),
        phone: new FormControl(null, [Validators.required]),
        description: new FormControl(null,[Validators.required]),
        unattendedUnitEntryAllowed: new FormControl(false,[Validators.required])
      })
      return {
        form
      }
    })
  );

  constructor(
    private readonly _maintenanceRequestService: MaintenanceRequestService,
    private readonly _profileService: ProfileService
  ) {

  }

  public save(createMainenanceRequest: CreateMaintenanceRequest) {
    this._maintenanceRequestService.create(createMainenanceRequest)
    .subscribe();
  }

}
