// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Route as NgRoute, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export class Route {
  static withLayout(routes: Routes): NgRoute {
    return {
      path: '',
      component: LayoutComponent,
      children: routes
    };
  }
};

