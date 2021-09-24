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

  @Output() public menuClick: EventEmitter<any> = new EventEmitter();



  constructor(
    private readonly _router: Router,
    private readonly _jsonContentService: JsonContentService
  ) { }


  private _navigatedToLandingPage$ = this._router.events
  .pipe(
    filter(e => e instanceof NavigationEnd),
    map((e:any) => e.url),
    map(url => url == '/'),
  );

  private _onLandingPage$ = merge(this._navigatedToLandingPage$, of(location.href.indexOf('landing') >= 0));

  public handleLogoClick() {
    this._router.navigate(["/"]);
  }

  public baseUrl = environment.baseUrl;

  public vm$ = combineLatest([this._jsonContentService.getByName({ name: JsonContentName.Hero }), this._onLandingPage$])
  .pipe(
    map(([jsonContent, onLandingPage]) => (Object.assign(jsonContent.json, { onLandingPage })))
  );

}
