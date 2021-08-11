import { Component} from '@angular/core';
import { NavigationService } from '@core';



@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  constructor(
    private readonly _navigationService: NavigationService
  ) {

  }

  public handleTitleClick() {
    this._navigationService.redirectToPublicDefault();
  }
}
