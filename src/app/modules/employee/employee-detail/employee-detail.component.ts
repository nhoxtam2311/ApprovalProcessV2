import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) { }

  employee!: Observable<any>
  projects!: Observable<any>
  tasks!: Observable<any>

  ngOnInit(): void {
    this.route.paramMap.subscribe((data: any) => {
      this.getEmployee(data.params["id"])
      this.getProjects(data.params["id"])
      this.getTasks(data.params["id"])
      this.init()
    })
  }

  getEmployee(employeeId: any) {
    this.employee = this.employeeService.getEmployee(employeeId)
  }
  getProjects(employeeId: any) {
    this.projects = this.projectService.findByOwner(employeeId)
  }
  getTasks(employeeId: any) {
    this.tasks = this.taskService.findByAssignedTo(employeeId)
  }

  modalClass = "modal"
  click() {
    if (this.modalClass == "modal") {
      this.modalClass = "modal show"
    } else {
      this.modalClass = "modal"
    }

  }

  employeeForm = new FormGroup({
    firstName: new FormControl("firstName"),
    lastName: new FormControl("lastName"),
    company: new FormControl("company"),
    jobTitle: new FormControl("jobTitle"),

    bussinessPhone: new FormControl("bussinessPhone"),
    homePhone: new FormControl("homePhone"),
    mobilePhone: new FormControl("mobilePhone"),
    faxNumber: new FormControl("faxNumber"),

    street: new FormControl("street"),
    city: new FormControl("city"),
    state: new FormControl("state"),
    zip: new FormControl("zip"),
    country: new FormControl("country"),

    emailAddress: new FormControl("emailAddress"),
  })

  update(employeeData: any) {
    {
      employeeData["firstName"] = this.employeeForm.value["firstName"]
      employeeData["lastName"] = this.employeeForm.value["lastName"]
      employeeData["company"] = this.employeeForm.value["company"]
      employeeData["jobTitle"] = this.employeeForm.value["jobTitle"]

      employeeData["bussinessPhone"] = this.employeeForm.value["bussinessPhone"]
      employeeData["homePhone"] = this.employeeForm.value["homePhone"]
      employeeData["mobilePhone"] = this.employeeForm.value["mobilePhone"]
      employeeData["faxNumber"] = this.employeeForm.value["faxNumber"]

      employeeData["street"] = this.employeeForm.value["street"]
      employeeData["city"] = this.employeeForm.value["city"]
      employeeData["state"] = this.employeeForm.value["state"]
      employeeData["zip"] = this.employeeForm.value["zip"]
      employeeData["country"] = this.employeeForm.value["country"]

      employeeData["emailAddress"] = this.employeeForm.value["emailAddress"]

    }
    this.employeeService.updateEmployee(employeeData).subscribe()
    this.click()
  }

  /* Chart */
  pieChartProject!: Chart
  pieChartTask!: Chart
  init() {

    let projects: any = {}
    var projectIds: Array<any> = []
    // console.log("project")
    this.projects.subscribe((projectsData: any) => {
      // console.log("project")
      for (let i = 0; i < projectsData._embedded.projects.length; i++) {
        let project = projectsData._embedded.projects[i]
        // let projectMonth = new Date(project.endDate).getMonth() + 1
        // console.log(projectMonth)
        if (project.status != 'DEFERRED') {
          if (project.status == 'COMPLETED') {
            if (projects[project.id]) {
              projects[project.id]['total'] = projects[project.id]['total'] + 1
              projects[project.id]['done'] = projects[project.id]['done'] + 1
            } else {
              projects[project.id] = { total: 1, done: 1, waiting: 0 }
              projectIds.push(project.id)
            }
          } else {
            if (project.status == 'WAITING') {
              if (projects[project.id]) {
                projects[project.id]['total'] = projects[project.id]['total'] + 1
                projects[project.id]['waiting'] = projects[project.id]['waiting'] + 1
              } else {
                projects[project.id] = { total: 1, done: 0, waiting: 1 }
                projectIds.push(project.id)
              }
            } else {

              if (projects[project.id]) {
                projects[project.id]['total'] = projects[project.id]['total'] + 1
              } else {
                projects[project.id] = { total: 1, done: 0, waiting: 0 }
                projectIds.push(project.id)
              }

            }
          }
        }
        // var total: any = {
        //   type: 'line',
        //   name: 'Total',
        //   data: []
        // }
        // var done: any = {
        //   type: 'line',
        //   name: 'Done',
        //   data: []
        // }
        // var inprogress: any = {
        //   type: 'line',
        //   name: 'In Progress',
        //   data: []
        // }

        var donePie: Array<any> = ["Done", 0]
        var waitingPie: Array<any> = ["Waiting", 0]
        var totalPie: Array<any> = ["Total", 0]
        var inProgressPie: Array<any> = ["inProgress", 0]

        var categories: Array<any> = []
        // console.log(projectIds)
        for (let id of projectIds) {
          // console.log(projects[id])
          let project = projects[id]
          // console.log(project)
          totalPie[1] = totalPie[1] + 1
          donePie[1] = donePie[1] + project.done
          waitingPie[1] = waitingPie[1] + project.waiting
          inProgressPie[1] = totalPie[1] - (donePie[1] + waitingPie[1])
          if (projects[i] == 0) {
            categories.push('-')
          } else {
            categories.push(projects[i])
          }
          // console.log(total.data)
        }

        this.pieChartProject = new Chart({
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
            // x: 35,
            align: 'center',
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
              size: '80%',
              innerSize: '10%',
            }
          },
          legend: {
            layout: 'vertical',
            // backgroundColor: '#transparent',
            floating: true,
            // align: 'left',
            x: 170,
            verticalAlign: 'top',
            y: 100,
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
            data: [inProgressPie, donePie, waitingPie]
          }]
        });
        this.pieChartProject.ref$.subscribe(console.log);
        // this.barChart.ref$.subscribe(console.log);
      }
    })

    this.tasks.subscribe((tasksData: any) => {
      var doneTask = 0
      var inprogressTask = 0
      var waitTask = 0
      var totalTask = 0
      for (let i = 0; i < tasksData._embedded.tasks.length; i++) {
        let task = tasksData._embedded.tasks[i]
        // let projectMonth = new Date(project.endDate).getMonth() + 1
        // console.log(projectMonth)
        totalTask = totalTask + 1
        if (task.status != 'DEFERRED') {
          if (task.status == 'COMPLETED') {
            doneTask = doneTask + 1
          } else {
            if (task.status == 'WAITING') {
              waitTask = waitTask + 1
            } else {
              inprogressTask = inprogressTask + 1
            }
          }
        }
      }
        // var total: any = {
          //   type: 'line',
          //   name: 'Total',
          //   data: []
        // }
        // var done: any = {
        //   type: 'line',
        //   name: 'Done',
        //   data: []
        // }
        // var inprogress: any = {
        //   type: 'line',
        //   name: 'In Progress',
        //   data: []
        // }

        var donePie: Array<any> = ["Done", doneTask]
        var waitingPie: Array<any> = ["Waiting", waitTask]
        var totalPie: Array<any> = ["Total", 0]
        var inProgressPie: Array<any> = ["inProgress", inprogressTask]

        // var categories: Array<any> = []
        // console.log(projectIds)
        // for (let id of projectIds) {
        //   // console.log(projects[id])
        //   let project = projects[id]
        //   // console.log(project)
        //   totalPie[1] = totalPie[1] + 1
        //   donePie[1] = donePie[1] + project.done
        //   waitingPie[1] = waitingPie[1] + project.waiting
        //   inProgressPie[1] = totalPie[1] - (donePie[1] + waitingPie[1])
        //   if (projects[i] == 0) {
        //     categories.push('-')
        //   } else {
        //     categories.push(projects[i])
        //   }
        //   // console.log(total.data)
        // }

        this.pieChartTask = new Chart({
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
            // x: 35,
            align: 'center',
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
              size: '80%',
              innerSize: '10%',
            }
          },
          legend: {
            layout: 'vertical',
            // backgroundColor: '#transparent',
            floating: true,
            // align: 'left',
            x: 170,
            verticalAlign: 'top',
            y: 100,
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
            data: [inProgressPie, donePie, waitingPie]
          }]
        });
        this.pieChartTask.ref$.subscribe(console.log);
        // this.barChart.ref$.subscribe(console.log);
    })

  }
}
