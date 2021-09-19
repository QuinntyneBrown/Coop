import { Component, Output, EventEmitter, Renderer2, AfterContentInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements AfterContentInit {
  @Input()
  public username: string = null;

  @Input()
  public password: string = null;

  @Input()
  public rememberMe: boolean = null;

  public form = new FormGroup({
    username: new FormControl(this.username, [Validators.required]),
    password: new FormControl(this.password, [Validators.required]),
    rememberMe: new FormControl(this.rememberMe,[])
  });

  @Output() public tryToLogin: EventEmitter<{ username: string, password: string }> = new EventEmitter();

  constructor(private readonly _renderer: Renderer2) { }

  ngAfterContentInit(): void {

    this.form.patchValue({
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    });

  }

}
