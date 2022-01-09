import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { OverviewComponent } from './overview/overview.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { EmployeePipe } from './employee.pipe';



@NgModule({
  declarations: [
    ProjectComponent,
    OverviewComponent,
    ProjectListComponent,
    ProjectDetailComponent,
    EmployeePipe
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule
  ]
})
export class ProjectModule { }
