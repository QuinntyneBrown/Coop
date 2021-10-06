import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateProfileRequest } from '@api';
import { UsernameExistsValidator } from '@core/username-exisits-validator';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent  {

  @Output() public tryToSignUp: EventEmitter<CreateProfileRequest> = new EventEmitter();

  public form = new FormGroup({
    invitationToken: new FormControl(null,[Validators.required]),
    firstname: new FormControl(null,[Validators.required]),
    lastname: new FormControl(null,[Validators.required]),
    email: new FormControl(null,[Validators.email,Validators.required],[this._usernameExistsValidator.validator()]),
    password: new FormControl(null,[Validators.required]),
    passwordConfirmation: new FormControl(null,[Validators.required]),
  });

  constructor(
    private readonly _usernameExistsValidator: UsernameExistsValidator
  ) {

  }

}
