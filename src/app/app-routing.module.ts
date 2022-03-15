import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './modules/employee/employee.component';
import { ProjectComponent } from './modules/project/project.component';
import { TaskComponent } from './modules/task/task.component';

const routes: Routes = [
  { path: 'project', component: ProjectComponent, loadChildren: () => import('./modules/project/project.module').then(m => m.ProjectModule) }, 
  { path: 'task', component: TaskComponent, loadChildren: () => import('./modules/task/task.module').then(m => m.TaskModule) },
  { path: 'employee', component: EmployeeComponent, loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule) },
  { path: 'employee/details/:id', component: EmployeeComponent, loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule) },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
