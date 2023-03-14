// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { JsonContentName, JsonContentService } from '@api';
import { combineLatest, merge, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {

  @Output() readonly menuClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly _router: Router,
    private readonly _jsonContentService: JsonContentService
  ) { }

  private readonly _navigatedToLandingPage$ = this._router.events
  .pipe(
    filter(e => e instanceof NavigationEnd),
    map((e:any) => e.url),
    map(url => url == '/'),
  );

  private readonly _onLandingPage$ = merge(this._navigatedToLandingPage$, of(location.href.indexOf('landing') >= 0));

  handleLogoClick() {
    this._router.navigate(["/"]);
  }

  readonly baseUrl = environment.baseUrl;

  readonly vm$ = combineLatest([this._jsonContentService.getByName({ name: JsonContentName.Hero }), this._onLandingPage$])
  .pipe(
    map(([jsonContent, onLandingPage]) => (Object.assign(jsonContent.json, { onLandingPage })))
  );

}

