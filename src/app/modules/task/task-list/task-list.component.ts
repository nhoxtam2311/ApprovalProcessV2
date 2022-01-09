import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    private employeeService: EmployeeService
  ) { }

  tasks!: Observable<any>
  projects!: Observable<any>
  employees!: Observable<any>

  ngOnInit(): void {
    this.pull()
    this.getProjects()
    this.getEmpolyees()
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
    this.tasks = this.taskService.getAll()
  }

  task = new FormGroup({
    title: new FormControl("Task Name"),
    project: new FormControl(Validators.required),
    description: new FormControl("Insuarance"),
    assignedTo: new FormControl(),
    startDate: new FormControl("2021-07-21"),
    endDate: new FormControl("2021-07-21"),
    priority: new FormControl("HIGH"),
    status: new FormControl("WAITING"),
    percentComplete: new FormControl(0),
    cost: new FormControl(200),
    costInDays: new FormControl(10)
  })

  create() {
    if(this.task.invalid){
      this.task.markAsTouched()
      return
    }
    var task = this.task.value
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
    this.projects = this.projectService.findByStatus("INPROGRESS")
  }

  getEmpolyees() {
    this.employees = this.employeeService.getAll()
  }

}
