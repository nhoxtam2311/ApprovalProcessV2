import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorService } from 'src/app/services/author-service.service';
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
    private router: Router,
    private authorService: AuthorService
  ) { }

  projects!: Observable<any>;
  employees!: Observable<any>
  author!: Observable<any>
  projectsByStatus!: Observable<any>
  sortField = 'createdDate'
  sortDesc = ''
  sortBy: any
  sortBool: Boolean = true
  currenPage: number = 0
  totalPages: number = 0
  currentProjectsStatus= "Status"

  ngOnInit(): void {
    this.pull()
    this.getAllEmployee()
    this.getAuthor()
  }

  pull(): void {
    this.projects = this.projectService.getAll(this.sortField, this.sortDesc)
  }


  modalCreateClass = "modal"
  modalChooseClass = "modal"

  sortStatusArrow ="fa fa-angle-down"
  sortCreatedArrow ="fa fa-angle-down"

  clickSortCreate(){
    if (this.sortCreatedArrow == "fa fa-angle-down") {
      this.sortCreatedArrow = "fa fa-angle-up"
    } else {
      this.sortCreatedArrow = "fa fa-angle-down"
    }
  }

  clickSortStatus(){
    if (this.sortStatusArrow == "fa fa-angle-down") {
      this.sortStatusArrow = "fa fa-angle-up"
    } else {
      this.sortStatusArrow = "fa fa-angle-down"
    }
  }

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

  getAuthor(){
    this.author = this.authorService.getAll()
  }

  getProjectByStatus(status: any){
    this.currentProjectsStatus = status.target.value
    if( this.currentProjectsStatus == "Status"){
      this.pull()
    }
    else{
      this.projects = this.projectService.findByStatus(this.currentProjectsStatus,this.sortField, this.sortDesc)
    }
    
    // console.log(this.projectsByStatus)
  }

  project = new FormGroup({
    projectName: new FormControl(),
    owner: new FormControl(),
    category: new FormControl(),
    priority: new FormControl(),
    status: new FormControl("WAITING"),
    startDate: new FormControl(),
    endDate: new FormControl(),
    budget: new FormControl(),
    budgetInDays: new FormControl(),
    // percentComplete: new FormControl(10)
  })


  create() {
    var project = this.project.value
    var createdDate = new Date()
    project.createdDate = `${createdDate.getFullYear()}-${createdDate.getMonth() + 1 > 9 ? createdDate.getMonth() + 1 : '0' + (createdDate.getMonth() + 1)}-${createdDate.getDate() > 9 ? createdDate.getDate() : '0' + createdDate.getDate()}`
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

  getAllEmployee() {
    this.employees = this.employeeService.getAll(0, 9999, 'firstName', '')
  }

  td = new Date()
  today = `${this.td.getFullYear()}-${this.td.getMonth() + 1 > 9 ? this.td.getMonth() + 1 : '0' + (this.td.getMonth() + 1)}-${this.td.getDate() > 9 ? this.td.getDate() : '0' + this.td.getDate()}T00:00:00.000+00:00`

  sortProjectBy(field: any) {
    this.sortField = field
    console.log(this.sortBool, this.sortDesc)
    if (this.sortBool === true) {
      this.sortBool = false
      this.sortDesc = "desc"
    } else {
      this.sortBool = true
      this.sortDesc = ''
    }
    console.log(this.sortBool, this.sortDesc)
    if( this.currentProjectsStatus== "Status"){
      this.projects = this.projectService.getAll(this.sortField, this.sortDesc)
    }
    else {
      this.projects = this.projectService.findByStatus(this.currentProjectsStatus,this.sortField, this.sortDesc)
    }
    console.log(this.currentProjectsStatus)
    
  }

}
