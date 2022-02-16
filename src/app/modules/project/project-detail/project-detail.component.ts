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
      // console.log(data.params["id"])
      this.resolvable = true
      this.getProject(data.params["id"])
      this.tasks = this.taskService.findByProject(data.params["id"])
      this.tasks.subscribe((data: any) => {
        this.resolvable = true
        for (let task of data._embedded.tasks) {
          if (task.status == 'INPROGRESS' || task.status == 'WAITING') {
            this.resolvable = false
          }
        }
      })
      this.init()
    this.getAllEmployee()
    })
    
  }

  getProject(projectId: any) {
    this.project = this.projectService.getProject(projectId)
  }

  /* Chart */
  barChart!: Chart
  pieChart!: Chart
  init() {
    var members: any = {}
    var ids: Array<any> = []
    this.tasks.subscribe((taskData: any) => {
      // console.log(taskData)
      for (var i = 0; i < taskData._embedded.tasks.length; i++) {
        let task = taskData._embedded.tasks[i]
        // console.log(taskData)
        if (task.status == 'COMPLETED') {
          if (members[task.assignedTo]) {
            members[task.assignedTo]['total'] = members[task.assignedTo]['total'] + 1
            members[task.assignedTo]['done'] = members[task.assignedTo]['done'] + 1
          } else {
            members[task.assignedTo] = { total: 1, done: 1, reject: 0 }
            ids.push(task.assignedTo)
          }
        }
        else {
          if (task.status == 'DEFERRED') {
            if (members[task.assignedTo]) {
              members[task.assignedTo]['total'] = members[task.assignedTo]['total'] + 1
              members[task.assignedTo]['reject'] = members[task.assignedTo]['reject'] + 1
            } else {
              members[task.assignedTo] = { total: 1, reject: 1, done: 0 }
              ids.push(task.assignedTo)
            }
          }
          else {
            if (members[task.assignedTo]) {
              members[task.assignedTo]['total'] = members[task.assignedTo]['total'] + 1
            } else {
              members[task.assignedTo] = { total: 1, done: 0, reject: 0 }
              ids.push(task.assignedTo)
            }
          }

        }

      }

      console.log(members)

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
      var donePie: Array<any> = ["Done", 0]
      var inprogressPie: Array<any> = ["In Progress", 0]
      var rejectPie: Array<any> = ["Reject", 0]

      // console.log(ids)

      var categories: Array<any> = []

      for (let id of ids) {
        let member = members[id]
        total.data.push(member.total)
        done.data.push(member.done)
        reject.data.push(member.reject)
        inprogress.data.push(member.total - member.done - member.reject)
        donePie[1] = donePie[1] + member.done
        rejectPie[1] = rejectPie[1] + member.reject
        inprogressPie[1] = inprogressPie[1] + (member.total - member.done - member.reject)

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
      // console.log(totalBar.data)

      // total.type = "bar"
      // done.type = "bar"
      // inprogress.type = "bar"

      this.barChart = new Chart({
        chart: {
          type: 'bar'
        },
        colors: ['rgb(124, 181, 236)', '#fe6694', 'rgb(144, 237, 125)', '#f77f00'],
        title: {
          text: 'barchart'
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
        colors: ['rgb(124, 181, 236)', '#fe6694', 'rgb(144, 237, 125)'],
        title: {
          text: 'piechart',
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
          backgroundColor: '#transparent',
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
          data: [inprogressPie, donePie, rejectPie]
        }]
      });
      this.pieChart.ref$.subscribe(console.log);
      this.barChart.ref$.subscribe(console.log);
    })
  }
  /* Chart */

  approve(project: any) {
    project["status"] = "INPROGRESS"
    var startDate = new Date()
    project["startDate"] = `${startDate.getFullYear()}-${startDate.getMonth()+1>9?startDate.getMonth()+1:'0'+(startDate.getMonth()+1)}-${startDate.getDate()>9?startDate.getDate():'0'+startDate.getDate()}`
    this.projectService.updateProject(project).subscribe()
  }

  decline(project: any) {
    project["status"] = "DEFERRED"
    this.projectService.updateProject(project).subscribe()
  }
  resolve(project: any) {
    project["status"] = "COMPLETED"
    var endDate = new Date()
    project["endDate"] = `${endDate.getFullYear()}-${endDate.getMonth()+1>9?endDate.getMonth()+1:'0'+(endDate.getMonth()+1)}-${endDate.getDate()>9?endDate.getDate():'0'+endDate.getDate()}`
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

