import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorService } from 'src/app/services/author-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor(
    private taskService: TaskService,
    private router: Router,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private authorService: AuthorService
  ) { }

  tasks!: Observable<any>
  projects!: Observable<any>
  employees!: Observable<any>
  author!: Observable<any>
  sortField ='createdDate'
  sortDesc = ''
  sortBy: any
  sortBool:Boolean = true
  currenPage: number = 0
  totalPages: number = 0
  currentTasksStatus= "Status"

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

  ngOnInit(): void {
    this.pull()
    this.getProjects()
    this.getEmpolyees()
    this.getAuthor()
  }

  modalCreateClass = "modal"
  modalChooseClass = "modal"

  clickShowCreateModal() {
    if (this.modalCreateClass == "modal") {
      this.modalCreateClass = "modal show"
    } else this.modalCreateClass = "modal"
  }

  clickShowChooseModal() {
    if (this.modalChooseClass == "modal") {
      this.modalChooseClass = "modal show"
    } else this.modalChooseClass = "modal"
  }

  pull(): void {
    this.tasks = this.taskService.getAll(this.sortField,this.sortDesc)
  }

  getAuthor(){
    this.author = this.authorService.getAll()
  }

  task = new FormGroup({
    title: new FormControl(),
    project: new FormControl(Validators.required),
    description: new FormControl(),
    assignedTo: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    priority: new FormControl(),
    status: new FormControl("WAITING"),
    percentComplete: new FormControl(0),
    cost: new FormControl(),
    costInDays: new FormControl()
  })

  create() {
    if(this.task.invalid){
      this.task.markAsTouched()
      return
    }
    var task = this.task.value
    var createdDate = new Date()
    task.createdDate = `${createdDate.getFullYear()}-${createdDate.getMonth()+1>9?createdDate.getMonth()+1:'0'+(createdDate.getMonth()+1)}-${createdDate.getDate()>9?createdDate.getDate():'0'+createdDate.getDate()}`
    console.log(task)
    console.log(this.task.value)
    this.taskService.create(task).subscribe(() => {
      this.pull()
      this.tasks.subscribe((data: any) => {
        this.clickShowCreateModal()
        let newTask = data["_embedded"]["tasks"][data["_embedded"]["tasks"].length - 1];
        this.router.navigate(["task", "details", newTask["id"]])
      })

    })
  }

  confirm() {
    this.clickShowChooseModal()
  }

  getProjects(): void{
    this.projects = this.projectService.findByStatus("INPROGRESS","createdDate","")
  }

  getEmpolyees() {
    this.employees = this.employeeService.getAll(0,9999,'firstName','')
  }

  td = new Date()
  today = `${this.td.getFullYear()}-${this.td.getMonth()+1>9?this.td.getMonth()+1:'0'+(this.td.getMonth()+1)}-${this.td.getDate()>9?this.td.getDate():'0'+this.td.getDate()}`

  sortTaskBy(field: any) {
    this.sortField = field
    console.log(this.sortBool,this.sortDesc)
    if (this.sortBool === true) {
      this.sortBool = false
      this.sortDesc = "desc"
    } else {
      this.sortBool = true
      this.sortDesc = ''
    }
    console.log(this.sortBool,this.sortDesc)
    if( this.currentTasksStatus== "Status"){
      this.tasks = this.taskService.getAll(this.sortField, this.sortDesc)
    }
    else {
      this.tasks = this.taskService.findByStatus(this.currentTasksStatus,this.sortField, this.sortDesc)
    }
    console.log(this.currentTasksStatus)
  }

  getTaskByStatus(status: any){
    this.currentTasksStatus = status.target.value
    if( this.currentTasksStatus == "Status"){
      this.pull()
    }
    else{
      this.tasks = this.taskService.findByStatus(this.currentTasksStatus,this.sortField, this.sortDesc)
    }
    
    // console.log(this.projectsByStatus)
  }

}
