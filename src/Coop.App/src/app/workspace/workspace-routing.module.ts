import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path:'',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
      { path: 'maintenance-requests', loadChildren: () => import('./maintenance-requests/maintenance-requests.module').then(m => m.MaintenanceRequestsModule) },
      { path: 'notices', loadChildren: () => import('./notices/notices.module').then(m => m.NoticesModule) },
      { path: 'by-laws', loadChildren: () => import('./by-laws/by-laws.module').then(m => m.ByLawsModule) },
      { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
      { path: 'members', loadChildren: () => import('./members/members.module').then(m => m.MembersModule) },
      { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },
      { path: 'board-members', loadChildren: () => import('./board-members/board-members.module').then(m => m.BoardMembersModule) },
      { path: 'staff-members', loadChildren: () => import('./staff-members/staff-members.module').then(m => m.StaffMembersModule) },
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
      { path: 'messages', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule) },
      { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
      { path: 'content', loadChildren: () => import('./content/content.module').then(m => m.ContentModule) }
    ]
  },
  { path: 'personalize', loadChildren: () => import('./personalize/personalize.module').then(m => m.PersonalizeModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
