import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { Users } from './components/pages/users/users';
import { Tasks } from './components/pages/tasks/tasks';
import { Login } from './components/pages/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'tasks', component: Tasks },
    ]
  }
];
