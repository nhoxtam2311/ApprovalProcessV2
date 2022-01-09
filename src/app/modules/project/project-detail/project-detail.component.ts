import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {
  }

  chart!: Chart
  id: any
  project!: Observable<any>
  tasks!: Observable<any>
  employees!: Observable<any>
  modalCreateClass = "modal"
  resolvable = true
  projectForm = new FormGroup({
    projectName: new FormControl("projectName"),
    owner: new FormControl(),
    category: new FormControl("Insuarance"),
    priority: new FormControl("HIGH"),
    // status: new FormControl("WAITING"),
    startDate: new FormControl("2021-07-21"),
    endDate: new FormControl("2021-07-22"),
    budget: new FormControl(500),
    budgetInDays: new FormControl(500),
  })

  ngOnInit(): void {
    this.route.paramMap.subscribe((data: any) => {
      console.log(data.params["id"])
      this.resolvable=true
      this.getProject(data.params["id"])
      this.tasks = this.taskService.findByProject(data.params["id"])
      this.tasks.subscribe((data:any)=>{
        this.resolvable=true
        for(let task of data._embedded.tasks){
          if(task.status == 'INPROGRESS' || task.status == 'WAITING'){
            this.resolvable=false
          }
        }
      })
    })
    this.init()
    this.getAllEmployee()
  }

  getProject(projectId: any) {
    this.project = this.projectService.getProject(projectId)
  }

  init() {
    var members: any = {}
    var ids: Array<any> = []
    this.tasks.subscribe((taskData: any) => {
      console.log(taskData)
      for (var i = 0; i < taskData._embedded.tasks.length; i++) {
        let task = taskData._embedded.tasks[i]
        console.log(taskData)
        if (task.status == 'COMPLETED') {
          if (members[task.assignedTo]) {
            members[task.assignedTo]['total'] = members[task.assignedTo]['total'] + 1
            members[task.assignedTo]['done'] = members[task.assignedTo]['done'] + 1
          } else {
            members[task.assignedTo] = { total: 1, done: 1 }
            ids.push(task.assignedTo)
          }
        } else {
          if (members[task.assignedTo]) {
            members[task.assignedTo]['total'] = members[task.assignedTo]['total'] + 1
          } else {
            members[task.assignedTo] = { total: 1, done: 0 }
            ids.push(task.assignedTo)
          }
        }

      }
      var total: any = {
        type: 'bar',
        name: 'Total',
        data: []
      }
      var done: any = {
        type: 'bar',
        name: 'Done',
        data: []
      }
      var inprogress: any = {
        type: 'bar',
        name: 'In Progress',
        data: []
      }
      console.log(ids)

      var categories : Array<any> =[]

      for (let id of ids) {
        let member = members[id]
        total.data.push(member.total)
        done.data.push(member.done)
        inprogress.data.push(member.total - member.done)
        if(id == 0){
          categories.push('-')
        }else{
          categories.push(id)
        }

        
        console.log(categories)
      }
      
      console.table(total, done)

      this.chart = new Chart({
        chart: {
          type: 'bar'
        },
        colors: ['green', '#465ee0', '#1aadce'],
        title: {
          text: 'Linechart'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: categories, title: {
            text: 'employees'
          }},
        series: [total, done, inprogress
        ]
      });
      // this.chart.addPoint(ids.length);
      // this.chart.addPoint(5);
      // setTimeout(() => {
      //   this.chart.addPoint(6);
      // }, 2000);

      this.chart.ref$.subscribe(console.log);
    })



  }

  approve(project: any) {
    project["status"] = "INPROGRESS"
    this.projectService.updateProject(project).subscribe()
  }

  decline(project: any) {
    project["status"] = "DEFERRED"
    this.projectService.updateProject(project).subscribe()
  }
  resolve(project: any) {
    project["status"] = "COMPLETED"
    this.projectService.updateProject(project).subscribe()
  } 

  clickShowCreateModal() {
    if (this.modalCreateClass == "modal") {
      this.modalCreateClass = "modal show"
    } else this.modalCreateClass = "modal"
  }

  update(projectData: any) {
    projectData["title"] = this.projectForm.value["title"]
    projectData["owner"] = this.projectForm.value["owner"]
    projectData["startDate"] = this.projectForm.value["startDate"]
    projectData["endDate"] = this.projectForm.value["endDate"]
    projectData["priority"] = this.projectForm.value["priority"]
    projectData["cost"] = this.projectForm.value["cost"]
    projectData["costInDays"] = this.projectForm.value["costInDays"]

    this.projectService.updateProject(projectData).subscribe()
    this.clickShowCreateModal()
  }

  getAllEmployee() {
    this.employees = this.employeeService.getAll()
  }

}
