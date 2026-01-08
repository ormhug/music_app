import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { RecordDetailComponent } from './components/record-detail/record-detail.component';
import { RecordFormComponent } from './components/record-form/record-form.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  //страница логина
  { path: 'login', component: LoginComponent },

  //список пластинок (защищен authGuard, значит только для вошедших)
  { 
    path: 'records', 
    component: RecordListComponent, 
    canActivate: [authGuard] 
  },

  //добавление новой (защищено)
  { 
    path: 'records/add', 
    component: RecordFormComponent, 
    canActivate: [authGuard] 
  },

  //редактирование (защищено)
  { 
    path: 'records/edit/:id', 
    component: RecordFormComponent, 
    canActivate: [authGuard] 
  },

  //просмотр деталей (защищено)
  { 
    path: 'records/:id', 
    component: RecordDetailComponent, 
    canActivate: [authGuard] 
  },

  //если путь пустой, то редирект на /records (или /login, сработает гард)
  { path: '', redirectTo: 'records', pathMatch: 'full' },

  //если ввели бред, то редирект на главную
  { path: '**', redirectTo: 'records' }
];