import { Component } from '@angular/core';
import { MessageService } from '@api';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {

  constructor(
    private readonly _messageService: MessageService
  ) {

  }

}
