import { Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MyroutinesComponent } from './myroutines/myroutines.component';
import { SearchroutinesComponent } from './searchroutines/searchroutines.component';
import { MyworkoutsComponent } from './myworkouts/myworkouts.component';
import { CreateroutineComponent } from './createroutine/createroutine.component';
import { ChatsComponent } from './chats/chats.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    title: 'login',
    component: AuthComponent,
  },
  {
    path: 'signin',
    title: 'signup',
    component: SignupComponent,
  },
  {
    path: 'dashboard',
    title: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'calendar',
        title: 'My calendar',
        component: CalendarComponent,
      },
      {
        path: 'myroutines',
        title: 'Mis rutinas',
        component: MyroutinesComponent,
      },
      {
        path: 'searchroutines',
        title: 'Buscar rutinas',
        component: SearchroutinesComponent,
      },
      {
        path: 'myworkouts',
        title: 'Mis entrenamientos',
        component: MyworkoutsComponent,
      },
      {
        path: 'createworkout',
        title: 'Crear rutina',
        component: CreateroutineComponent,
      },
      {
        path: 'chats',
        title: 'My chats',
        component: ChatsComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
