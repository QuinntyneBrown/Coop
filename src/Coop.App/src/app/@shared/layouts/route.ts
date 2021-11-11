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
