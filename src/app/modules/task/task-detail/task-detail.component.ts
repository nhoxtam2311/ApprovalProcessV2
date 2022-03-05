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
    title: new FormControl(),
    // projectName: new FormControl(Validators.required),
    description: new FormControl(),
    assignedTo: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    priority: new FormControl(),
    // status: new FormControl("WAITING"),
    // percentComplete: new FormControl(0),
    cost: new FormControl(),
    costInDays: new FormControl()
  })

  taskCreateForm = new FormGroup({
    title: new FormControl(),
    // project: new FormControl(Validators.required),
    // description: new FormControl("Insuarance"),
    assignedTo: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    priority: new FormControl(),
    status: new FormControl("WAITING"),
    // percentComplete: new FormControl(0),
    cost: new FormControl(),
    costInDays: new FormControl()
  })

  employees!: Observable<any>
  modalCreateClass = "modal"
  modalCreateSubTaskClass = "modal"

  resolvable = true

  ngOnInit(): void {
    this.route.paramMap.subscribe((data: any) => {

      this.id = data.params["id"]
      this.getTask(data.params["id"])
      this.subTasks = this.taskService.findByParent(data.params["id"])
      this.resolvable = true
      this.subTasks.subscribe((data: any) => {
        this.resolvable = true
        for (let subTask of data._embedded.tasks) {
          if (subTask.status == 'INPROGRESS' || subTask.status == 'WAITING') {
            this.resolvable = false
          }
        }
      })
      this.init()
      this.getEmpolyees()
    })

  }

  projectId: any;
  getTask(taskId: any) {
    this.task = this.taskService.getTask(taskId)
    this.task.subscribe(data => {
      this.projectId = data.project
    })
  }

  /* Chart */
  barChart!: Chart
  pieChart!: Chart
  init() {
    var members: any = {}
    var ids: Array<any> = []
    this.subTasks.subscribe((subTasksData: any) => {
      var doneTask = 0
      var inprogressTask = 0
      var waitTask = 0
      var totalTask = 0
      var deferredTask = 0
      console.log(subTasksData)
      for (var i = 0; i < subTasksData._embedded.tasks.length; i++) {
        let subTask = subTasksData._embedded.tasks[i]
        // console.log(taskData)
        if (subTask.status == 'COMPLETED') {
          if (members[subTask.assignedTo]) {
            members[subTask.assignedTo]['total'] = members[subTask.assignedTo]['total'] + 1
            members[subTask.assignedTo]['done'] = members[subTask.assignedTo]['done'] + 1
          } else {
            members[subTask.assignedTo] = { total: 1, done: 1, reject: 0 }
            ids.push(subTask.assignedTo)
          }
        }
        else {
          if (subTask.status == 'DEFERRED') {
            if (members[subTask.assignedTo]) {
              members[subTask.assignedTo]['total'] = members[subTask.assignedTo]['total'] + 1
              members[subTask.assignedTo]['reject'] = members[subTask.assignedTo]['reject'] + 1
            } else {
              members[subTask.assignedTo] = { total: 1, reject: 1, done: 0 }
              ids.push(subTask.assignedTo)
            }
          }
          else {
            if (members[subTask.assignedTo]) {
              members[subTask.assignedTo]['total'] = members[subTask.assignedTo]['total'] + 1
            } else {
              members[subTask.assignedTo] = { total: 1, done: 0, reject: 0 }
              ids.push(subTask.assignedTo)
            }
          }

        }

        totalTask = totalTask + 1
        if (subTask.status != 'DEFERRED') {
          if (subTask.status == 'COMPLETED') {
            doneTask = doneTask + 1
          } else {
            if (subTask.status == 'WAITING') {
              waitTask = waitTask + 1
            } else {
              inprogressTask = inprogressTask + 1
            }
          }
        } else { deferredTask = deferredTask + 1 }

      }

      // console.log(members)

      var total: any = {
        // type: 'bar',
        name: 'Total',
        data: []
      }
      var done: any = {
        // type: 'bar',
        name: 'Done',
        data: []
      }
      var inprogress: any = {
        // type: 'bar',
        name: 'In Progress',
        data: []
      }
      var reject: any = {
        // type: 'bar',
        name: 'Reject',
        data: []
      }
      // var donePie: Array<any> = ["Done", 0]
      // var inprogressPie: Array<any> = ["In Progress", 0]
      // var rejectPie: Array<any> = ["Reject", 0]

      // console.log(ids)

      var categories: Array<any> = []

      var donePie: Array<any> = ["Done: " + doneTask, doneTask]
      var waitingPie: Array<any> = ["Waiting: " + waitTask, waitTask]
      var totalPie: Array<any> = ["Total", 0]
      var inProgressPie: Array<any> = ["inProgress: " + inprogressTask, inprogressTask]
      var deferredPie: Array<any> = ["Reject: " + deferredTask, deferredTask]
      // console.log(totalBar.data)

      // total.type = "bar"
      // done.type = "bar"
      // inprogress.type = "bar"

      var categories: Array<any> = []

      for (let id of ids) {
        let member = members[id]
        total.data.push(member.total)
        done.data.push(member.done)
        reject.data.push(member.reject)
        inprogress.data.push(member.total - member.done - member.reject)
        // donePie[1] = donePie[1] + member.done
        // rejectPie[1] = rejectPie[1] + member.reject
        // inprogressPie[1] = inprogressPie[1] + (member.total - member.done - member.reject)

        // rejectPie.push(member.reject)
        // donePie.push(member.done)
        // inprogressPie.push(member.total - member.done - member.reject)
        if (id == 0) {
          categories.push('-')
        } else {
          categories.push(id)
        }
        // console.log(categories)
      }

      this.barChart = new Chart({
        chart: {
          type: 'bar'
        },
        colors: ['rgb(124, 181, 236)', '#fe6694', 'rgb(144, 237, 125)', '#f77f00'],
        title: {
          text: 'Employee\'s subtasks progress '
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: categories, title: {
            text: 'employees'
          }
        },
        series: [total, done, inprogress, reject]
      });

      // total.type = "pie"
      // done.type = "pie"
      // inprogress.type = "pie"
      // console.log(done[1])

      this.pieChart = new Chart({
        chart: {
          type: 'pie',
          plotShadow: false,
          backgroundColor: 'transparent',
          height: '300px',
          // width: '100px'
        },
        colors: ['rgb(124, 181, 236)', '#fe6694', 'rgb(144, 237, 125)', '#f59e1b'],
        title: {
          text: 'Subtasks',
          x: 35,
          align: 'left',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true,
            shadow: false,
            center: ['20%', '30%'],
            size: '80%',
            innerSize: '10%',
          }
        },
        legend: {
          layout: 'vertical',
          // backgroundColor: '#transparent',
          floating: true,
          // align: 'left',
          x: 90,
          verticalAlign: 'top',
          y: 70,
          itemMarginTop: 10,
          itemMarginBottom: 5
        },
        // xAxis: {
        //   categories: categories, title: {
        //     text: 'employees'
        //   }},
        series: [{
          type: 'pie',
          name: 'Tasks',
          // data: [total.data - inprogress.data - reject.data, inprogress.data, reject.data]
          // data: [['Total',total.data - inprogress.data - reject.data], ['In Progress',inprogress.data], ['Reject',reject.data]]
          data: [inProgressPie, donePie, waitingPie, deferredPie]
        }]
      });
      this.pieChart.ref$.subscribe(console.log);
      this.barChart.ref$.subscribe(console.log);
    })
  }
  /* Chart */

  approve(task: any) {
    task["status"] = "INPROGRESS"
    var startDate = new Date()
    task["startDate"] = `${startDate.getFullYear()}-${startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 : '0' + (startDate.getMonth() + 1)}-${startDate.getDate() > 9 ? startDate.getDate() : '0' + startDate.getDate()}`
    this.taskService.updateTask(task).subscribe()
  }

  decline(task: any) {
    task["status"] = "DEFERRED"
    this.taskService.updateTask(task).subscribe()
  }

  resolve(task: any) {
    task["status"] = "COMPLETED"
    var endDate = new Date()
    task["endDate"] = `${endDate.getFullYear()}-${endDate.getMonth() + 1 > 9 ? endDate.getMonth() + 1 : '0' + (endDate.getMonth() + 1)}-${endDate.getDate() > 9 ? endDate.getDate() : '0' + endDate.getDate()}`
    this.taskService.updateTask(task).subscribe()
  }

  pull() {
    this.getTask(this.id)
    this.init()
  }

  update(taskData: any) {
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
    if (this.taskCreateForm.invalid) {
      this.taskCreateForm.markAsTouched()
      return
    }
    var task = this.taskCreateForm.value
    var createdDate = new Date()
    task.createdDate = `${createdDate.getFullYear()}-${createdDate.getMonth() + 1 > 9 ? createdDate.getMonth() + 1 : '0' + (createdDate.getMonth() + 1)}-${createdDate.getDate() > 9 ? createdDate.getDate() : '0' + createdDate.getDate()}`

    task.parent = this.id
    task.project = this.projectId
    console.log(task)
    console.log(this.taskCreateForm.value)
    this.taskService.create(task).subscribe(() => {
      this.clickShowCreateSubTaskModal()
      this.pull()
    })

  }

}
