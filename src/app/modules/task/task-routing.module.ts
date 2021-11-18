import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskComponent } from './task.component';

const routes: Routes = [
  {path:"", component: OverviewComponent},
  {path:"details", component: TaskDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
