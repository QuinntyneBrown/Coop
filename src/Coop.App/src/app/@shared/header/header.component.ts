import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() readonly menuClick: EventEmitter<void> = new EventEmitter();

  readonly vm$ = this._jsonContentService.getByName({ name: JsonContentName.Hero })
  .pipe(
    map(jsonContent => jsonContent.json)
  );

  constructor(
    private readonly _router: Router,
    private readonly _jsonContentService: JsonContentService
  ) { }

  headerClick() {
    this._router.navigate(["/"]);
  }

  readonly baseUrl = environment.baseUrl;
}
