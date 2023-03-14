// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AddressEditorIntl {
  public readonly street$: Observable<string> = of("Street");
  public readonly unit$: Observable<string> = of("Unit");
  public readonly city$: Observable<string> = of("City");
  public readonly province$: Observable<string> = of("Province");
  public readonly postalCode$: Observable<string> = of("Postal Code");

  public readonly streetError$: Observable<string> = of("Street is required.");
  public readonly unitError$: Observable<string> = of("Unit is required");
  public readonly cityError$: Observable<string> = of("City is required");
  public readonly provinceError$: Observable<string> = of("Province is required");
  public readonly postalCodeError$: Observable<string> = of("Postal Code is required");


  public displayProvinceWith$(province:string) {
    return of(province);
  }

}

