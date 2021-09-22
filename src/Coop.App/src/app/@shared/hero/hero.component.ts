import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {

  @Output() public menuClick: EventEmitter<any> = new EventEmitter();

  public vm$ = this._jsonContentService.getByName({ name: JsonContentName.Hero })
  .pipe(
    map(jsonContent => jsonContent.json)
  );

  constructor(
    private readonly _router: Router,
    private readonly _jsonContentService: JsonContentService
  ) {

  }

  public handleLogoClick() {
    this._router.navigate(["/"]);
  }

  public baseUrl = environment.baseUrl;

}
