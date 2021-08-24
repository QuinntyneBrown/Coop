import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() public heading: string = "OWN Housing Co-operative";
  @Input() public subHeading: string = "Integrity, Strength, Action";

  constructor(
    private readonly _router: Router
  ) {

  }

  public headerClick() {
    this._router.navigate(["/"]);
  }
}
