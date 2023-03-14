// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { UserService } from "@api";
import { Observable, of } from "rxjs";
import { map, debounceTime, take, switchMap } from "rxjs/operators";

function isEmptyInputValue(value: any): boolean {
  return value === null || value.length === 0;
}

@Injectable({
  providedIn: "root"
})
export class UsernameExistsValidator {
  constructor(
    private readonly _userService: UserService) {}

  validator(initial: string = ""): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {
      if (isEmptyInputValue(control.value)) {
        return of(null);
      } else if (control.value === initial) {
        return of(null);
      } else {
        return control.valueChanges.pipe(
          debounceTime(300),
          take(1),
          switchMap(_ =>
            this._userService
              .exists({ username: control.value })
              .pipe(
                map(exists =>
                  exists ? { existingValue: { value: control.value } } : null
                )
              )
          )
        );
      }
    };
  }
}

