import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() public heading: string = "OWN Housing Co-operative";
  @Input() public subHeading: string = "Integrity, Strenghth, Action";
}
