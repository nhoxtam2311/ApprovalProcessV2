import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { OverviewComponent } from './overview/overview.component';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectPipe } from './project.pipe';
import { EmployeePipe } from './employee.pipe';
import { TaskPipe } from './task.pipe';
import { MomentModule } from 'ngx-moment';


@NgModule({
  declarations: [
    TaskComponent,
    TaskListComponent,
    TaskDetailComponent,
    OverviewComponent,
    ProjectPipe,
    EmployeePipe,
    TaskPipe
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule
  ]
})
export class TaskModule { }
