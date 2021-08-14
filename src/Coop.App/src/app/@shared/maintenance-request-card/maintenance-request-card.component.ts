import { Component, Input, OnInit } from '@angular/core';
import { MaintenanceRequest } from '@api';

@Component({
  selector: 'app-maintenance-request-card',
  templateUrl: './maintenance-request-card.component.html',
  styleUrls: ['./maintenance-request-card.component.scss']
})
export class MaintenanceRequestCardComponent {

  @Input() maintenanceRequest!: MaintenanceRequest;
}
