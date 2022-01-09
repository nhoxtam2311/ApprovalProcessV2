import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  projects!: Observable<any>;
  employees!: Observable<any>

  ngOnInit(): void {
    this.pull()
    this.getAllEmployee()
  }

  pull(): void {
    this.projects = this.projectService.getAll()
  }


  modalCreateClass = "modal"
  modalChooseClass = "modal"

  clickShowCreateModal() {
    if (this.modalCreateClass == "modal") {
      this.modalCreateClass = "modal show"
    } else {
      this.modalCreateClass = "modal"
    }
  }

  clickShowChooseModal() {
    if (this.modalChooseClass == "modal") {
      this.modalChooseClass = "modal show"
    } else this.modalChooseClass = "modal"
  }



  project = new FormGroup({
    projectName: new FormControl("projectName"),
    owner: new FormControl(),
    category: new FormControl("Insuarance"),
    priority: new FormControl("HIGH"),
    status: new FormControl("WAITING"),
    startDate: new FormControl("2021-07-21"),
    endDate: new FormControl("2021-07-22"),
    budget: new FormControl(500),
    budgetInDays: new FormControl(500),
  })


  create() {
    var project = this.project.value
    this.projectService.create(project).subscribe(() => {
      // this.project.reset()
      this.pull()
      this.projects.subscribe((data: any) => {
        this.clickShowCreateModal()
        let newProject = data["_embedded"]["projects"][data["_embedded"]["projects"].length - 1];
        this.router.navigate(["project", "details", newProject["id"]])
      })
    })
  }

  // confirm(){
  //   this.clickShowChooseModal()
  // }

  getAllEmployee(){
    this.employees = this.employeeService.getAll()
  }
}
