import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  @Output() readonly logoutClicked: EventEmitter<any> = new EventEmitter();

  logout() {
    this.logoutClicked.emit();
  }
}
