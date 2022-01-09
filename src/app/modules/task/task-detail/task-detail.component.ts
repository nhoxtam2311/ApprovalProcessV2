import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService 
  ) { }

  chart!: Chart
  id: any
  task!: Observable<any>
  subTasks!: Observable<any>
  text: any
  taskForm = new FormGroup({
    title: new FormControl("Task Name"),
    // projectName: new FormControl(Validators.required),
    description: new FormControl(),
    assignedTo: new FormControl(),
    startDate: new FormControl("2021-07-21"),
    endDate: new FormControl("2021-07-21"),
    priority: new FormControl("HIGH"),
    // status: new FormControl("WAITING"),
    // percentComplete: new FormControl(0),
    cost: new FormControl(200),
    costInDays: new FormControl(10)
  })

  taskCreateForm = new FormGroup({
    title: new FormControl("Task Name"),
    // project: new FormControl(Validators.required),
    // description: new FormControl("Insuarance"),
    assignedTo: new FormControl(),
    startDate: new FormControl("2021-07-21"),
    endDate: new FormControl("2021-07-21"),
    priority: new FormControl("HIGH"),
    status: new FormControl("WAITING"),
    // percentComplete: new FormControl(0),
    cost: new FormControl(200),
    costInDays: new FormControl(10)
  })

  employees!: Observable<any>
  modalCreateClass = "modal"
  modalCreateSubTaskClass = "modal"
  
  resolvable = true

  ngOnInit(): void {
    this.route.paramMap.subscribe((data: any)=>{
      
      this.id = data.params["id"]
      this.getTask(data.params["id"])
      this.subTasks = this.taskService.findByParent(data.params["id"])
      this.resolvable=true
      this.subTasks.subscribe((data:any)=>{
        this.resolvable=true
        for(let subTask of data._embedded.tasks){
          if(subTask.status == 'INPROGRESS' || subTask.status == 'WAITING'){
            this.resolvable=false
          }
        }
      })
    })
    this.init()
    this.getEmpolyees()
    
  }

  projectId : any;
  getTask(taskId: any){
    this.task = this.taskService.getTask(taskId)
    this.task.subscribe(data=>{
      this.projectId = data.project
    })
  }

  init() {
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Linechart'
      },
      credits: {
        enabled: false
      },
      series: [{
        type: 'line',
        name: 'Line 1',
        data: [1, 2, 3]
      }]
    });
    this.chart.addPoint(4);
    this.chart.addPoint(5);
    setTimeout(() => {
      this.chart.addPoint(6);
    }, 2000);

    this.chart.ref$.subscribe(console.log);
  }

  approve(task: any) {
    task["status"] = "INPROGRESS"
    this.taskService.updateTask(task).subscribe()
  }

  decline(task: any) {
    task["status"] = "DEFERRED"
    this.taskService.updateTask(task).subscribe()
  }

  resolve(task: any) {
    task["status"] = "COMPLETED"
    this.taskService.updateTask(task).subscribe()
  }

  pull(){
    this.getTask(this.id)
  }

  update(taskData: any){
    taskData["title"] = this.taskForm.value["title"]
    taskData["assignedTo"] = this.taskForm.value["assignedTo"]
    taskData["startDate"] = this.taskForm.value["startDate"]
    taskData["endDate"] = this.taskForm.value["endDate"]
    taskData["priority"] = this.taskForm.value["priority"]
    taskData["cost"] = this.taskForm.value["cost"]
    taskData["costInDays"] = this.taskForm.value["costInDays"]
    taskData["description"] = this.taskForm.value["description"]
    
    this.taskService.updateTask(taskData).subscribe()
    this.clickShowCreateModal()
  }
  
  clickShowCreateModal() {
    if (this.modalCreateClass == "modal") {
      this.modalCreateClass = "modal show"
    } else this.modalCreateClass = "modal"
  }

  clickShowCreateSubTaskModal() {
    if (this.modalCreateSubTaskClass == "modal") {
      this.modalCreateSubTaskClass = "modal show"
    } else this.modalCreateSubTaskClass = "modal"
  }

  getEmpolyees() {
    this.employees = this.employeeService.getAll()
  }

  createSubTask() {
    if(this.taskCreateForm.invalid){
      this.taskCreateForm.markAsTouched()
      return
    }
    var task = this.taskCreateForm.value
    task.parent = this.id
    task.project = this.projectId
    console.log(task)
    console.log(this.taskCreateForm.value)
    this.taskService.create(task).subscribe(()=>{
      this.clickShowCreateSubTaskModal()
      this.pull()
    })
    
  }

}
