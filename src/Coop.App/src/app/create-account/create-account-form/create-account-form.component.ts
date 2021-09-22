import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CreateProfileRequest } from '@api';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent  {

  @Output() public tryToSignUp: EventEmitter<CreateProfileRequest> = new EventEmitter();

  public form = new FormGroup({
    invitationToken: new FormControl(null,[]),
    firstname: new FormControl(null,[]),
    lastname: new FormControl(null,[]),
    email: new FormControl(null,[]),
    password: new FormControl(null,[]),
    passwordConfirmation: new FormControl(null,[]),
  });

}
