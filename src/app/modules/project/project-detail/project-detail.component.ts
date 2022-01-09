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

  barChart!: Chart
  pieChart!: Chart

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
      // console.log(taskData)
      for (var i = 0; i < taskData._embedded.tasks.length; i++) {
        let task = taskData._embedded.tasks[i]
        // console.log(taskData)
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

      // console.log(members)

      var totalBar: any = {
        // type: 'bar',
        name: 'Total',
        data: []
      }
      var doneBar: any = {
        // type: 'bar',
        name: 'Done',
        data: []
      }
      var inprogressBar: any = {
        // type: 'bar',
        name: 'In Progress',
        data: []
      }
      var donePie: Array<any> = ["Done", 0]
      var inprogressPie: Array<any> = ["In Progress", 0]

      // console.log(ids)

      var categories: Array<any> = []

      for (let id of ids) {
        let member = members[id]
        totalBar.data.push(member.total)
        doneBar.data.push(member.done)
        inprogressBar.data.push(member.total - member.done)
        donePie[1] = donePie[1] + 1
        console.log(donePie[1])
        inprogressPie[1] = inprogressPie[1] + 1
        // totalPie.push(member.total)
        // donePie.push(member.done)
        // inprogressPie.push(member.total - member.done)
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
        colors: ['rgb(124, 181, 236)', '#fe6694', 'rgb(144, 237, 125)'],
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
        series: [totalBar, doneBar, inprogressBar]
      });

      // total.type = "pie"
      // done.type = "pie"
      // inprogress.type = "pie"
      console.log(donePie[1])

      this.pieChart = new Chart({
        chart: {
          type: 'pie',
          plotShadow: false
        },
        colors: ['rgb(124, 181, 236)', '#fe6694', 'rgb(144, 237, 125)'],
        title: {
          text: 'piechart'
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
            center: ['50%', '50%'],
            size: '45%',
            innerSize: '20%',
          }
        },
        // xAxis: {
        //   categories: categories, title: {
        //     text: 'employees'
        //   }},
        series: [{
          type: 'pie',
          name: 'Tasks',
          data: [donePie, inprogressPie]
        }]
      });
      this.pieChart.ref$.subscribe(console.log);
      this.barChart.ref$.subscribe(console.log);
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
