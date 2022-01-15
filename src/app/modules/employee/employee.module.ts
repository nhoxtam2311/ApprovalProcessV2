import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectPipe } from './project.pipe';
import { ChartModule } from 'angular-highcharts';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeDetailComponent,
    EmployeeListComponent,
    ProjectPipe
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule
  ]
})
export class EmployeeModule { }
