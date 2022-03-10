import { formatDate } from '@angular/common';
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
  currentProjectsStatus = "Status"
  td = new Date()
  today = `${this.td.getFullYear()}-${this.td.getMonth() + 1 > 9 ? this.td.getMonth() + 1 : '0' + (this.td.getMonth() + 1)}-${this.td.getDate() > 9 ? this.td.getDate() : '0' + this.td.getDate()}T00:00:00.000+00:00`
  month: any = `${this.td.getMonth() + 1 > 9 ? this.td.getMonth() + 1 : '0' + (this.td.getMonth() + 1)}`
  year: any =`${this.td.getFullYear()}`
  // test: any = "2022-03-05T00:00:00.000+00:00"
  show: any = ""

  ngOnInit(): void {
    this.pull()
    this.getAllEmployee()
    this.getAuthor()
  }

  pull(): void {
    this.projects = this.projectService.getAll(this.sortField, this.sortDesc)
    // this.projects.subscribe((data:any)=>{
    //   console.log(data["_embedded"]["projects"][1]["createdDate"])
    // })
  }


  modalCreateClass = "modal"
  modalChooseClass = "modal"

  sortStatusArrow = "fa fa-angle-down"
  sortCreatedArrow = "fa fa-angle-down"

  clickSortCreate() {
    if (this.sortCreatedArrow == "fa fa-angle-down") {
      this.sortCreatedArrow = "fa fa-angle-up"
    } else {
      this.sortCreatedArrow = "fa fa-angle-down"
    }
  }

  clickSortStatus() {
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

  getAuthor() {
    this.author = this.authorService.getAll()
  }

  getProjectByStatus(status: any) {
    this.currentProjectsStatus = status.target.value
    if (this.currentProjectsStatus == "Status") {
      this.pull()
    }
    else {
      this.projects = this.projectService.findByStatus(this.currentProjectsStatus, this.sortField, this.sortDesc)
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
    project.createdDate = `${createdDate.getFullYear()}-${createdDate.getMonth() + 1 > 9 ? createdDate.getMonth() + 1 : '0' + (createdDate.getMonth() + 1)}-${createdDate.getDate() > 9 ? createdDate.getDate() : '0' + createdDate.getDate()}T00:00:00.000+00:00`
    // console.log(project.createdDate)
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


  sortProjectBy(field: any) {
    this.sortField = field
    // console.log(this.sortBool, this.sortDesc)
    if (this.sortBool === true) {
      this.sortBool = false
      this.sortDesc = "desc"
    } else {
      this.sortBool = true
      this.sortDesc = ''
    }
    // console.log(this.sortBool, this.sortDesc)
    if (this.currentProjectsStatus == "Status") {
      this.projects = this.projectService.getAll(this.sortField, this.sortDesc)
    }
    else {
      this.projects = this.projectService.findByStatus(this.currentProjectsStatus, this.sortField, this.sortDesc)
    }
    // console.log(this.currentProjectsStatus)
  }


  getMonthChanged(change: any) {
    this.month = change.target.value[5] + change.target.value[6]
    this.year = change.target.value[0] + change.target.value[1] + change.target.value[2] + change.target.value[3]
    // console.log(this.month + "+" + this.year)
    if (this.currentProjectsStatus == "Status") {
      this.projects = this.projectService.getAll(this.sortField, this.sortDesc)
    }
    else {
      this.projects = this.projectService.findByStatus(this.currentProjectsStatus, this.sortField, this.sortDesc)
    }
  }

  check(createDay: any) {
    // console.log(this.month + this.year)
    if (((createDay[5] + createDay[6]) == this.month) && ((createDay[0] + createDay[1] + createDay[2] + createDay[3]) == this.year)) {
      this.show = ''
      return true

    } else {
      this.show = 'display: none'
      return false
    }
  }

  // getMonthChanged(month: any){
  //   let year = month.target.value[0] + month.target.value[1] + month.target.value[2] + month.target.value[3]
  //   let months = month.target.value[5] + month.target.value[6]
  //   let day = month.target.value[8] + month.target.value[9]

  //   var testDay
  //   console.log(month.target.value + "T00:00:00.000+00:00")

  //   // console.log(" ..." + month.target.value)
  //   // console.log("year "  + year )
  //   // console.log("month" + months)
  //   // console.log("day" + day)

  //   testDay = new Date(month.target.value + "T00:00:00.000+00:00")
  //   let lastDay = `${testDay.getFullYear()}-${testDay.getMonth() + 1 > 9 ? testDay.getMonth() + 1 : '0' + (testDay.getMonth() + 1)}-${testDay.getDate() > 9 ? testDay.getDate() : '0' + testDay.getDate()}T00:00:00.000+00:00`
  //   // console.log(testDay)
  //   console.log(lastDay)
  //   // console.log(year + '-' + months + '-' + day + 'T00:00:00.000+00:00')

  //   this.projects = this.projectService.findByCreatedDate(lastDay)

  //   //   this.projects.subscribe((data:any)=>{
  //   //     console.log(data._embedded)
  //   //   })

  // }

}
