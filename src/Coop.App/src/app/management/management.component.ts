import { Component, Inject } from '@angular/core';
import { JsonContentName, JsonContentService } from '@api';
import { baseUrl } from '@core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent {

  public vm$ = this._jsonContentService.getByName({ name: JsonContentName.ManagementStaff })
  .pipe(
    map(jsonContent => ({
      boardMembers: jsonContent.json.managementStaff,
      heading: jsonContent.json.heading,
      subheading: jsonContent.json.subheading
    }))
  );

  constructor(
    private readonly _jsonContentService: JsonContentService,
    @Inject(baseUrl) public readonly baseUrl: string
  ) { }

}
