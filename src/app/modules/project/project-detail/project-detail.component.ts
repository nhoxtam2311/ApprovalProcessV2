import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { Observable } from 'rxjs';
import { AuthorService } from 'src/app/services/author-service.service';
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
    private route: ActivatedRoute,
    private authorService: AuthorService
  ) {
  }

  id: any
  totalPages: number = 0
  project!: Observable<any>
  tasks!: Observable<any>
  author!: Observable<any>
  sortBy: any
  sortDesc = ''
  sortBool:Boolean = true
  sortField ='createdDate'
  currenPage: number = 0
  employees!: Observable<any>
  modalCreateClass = "modal"
  resolvable = true
  currentTasksStatus= "Status"
  sortStatusArrow = "fa fa-angle-down"
  sortCreatedArrow = "fa fa-angle-down"

  tasksByStatus!: Observable<any>



  projectForm = new FormGroup({
    projectName: new FormControl(),
    owner: new FormControl(),
    category: new FormControl(),
    priority: new FormControl(),
    // status: new FormControl("WAITING"),
    startDate: new FormControl(),
    endDate: new FormControl(),
    budget: new FormControl(),
    budgetInDays: new FormControl(),
  })

  ngOnInit(): void {
    this.route.paramMap.subscribe((data: any) => {
      this.id = data.params["id"]
      // console.log(data.params["id"])
      this.resolvable = true
      this.getProject(data.params["id"])
      this.tasks = this.taskService.findByProject(data.params["id"], 0, this.sortField, this.sortDesc)
      this.tasks.subscribe((data: any) => {
        this.totalPages = data.page.totalPages
        this.resolvable = true
        for (let task of data._embedded.tasks) {
          if (task.status == 'INPROGRESS' || task.status == 'WAITING') {
            this.resolvable = false
          }
        }
      })
      this.init()
      this.getAllEmployee()
      this.getAuthor()
      this.author.subscribe((data:any)=>{
        data.authorities.authority
        console.log(data.authorities[0].authority)
      })
    })

  }

  getProject(projectId: any) {
    this.project = this.projectService.getProject(projectId)
  }

  getAuthor(){
    this.author = this.authorService.getAll()
  }

  getTasks(projectId: any, page: number, sortBy: any, sortDesc: any) {
    this.tasks = this.taskService.findByProject(projectId, page, sortBy, sortDesc)
    this.tasks.subscribe((data: any) => {
      this.totalPages = data.page.totalPages
    })
  }

  getTasksByStatus(){

  }

  /* Chart */
  barChart!: Chart
  pieChart!: Chart
  init() {
    var members: any = {}
    var ids: Array<any> = []
    this.tasks.subscribe((taskData: any) => {
      var doneTask = 0
      var inprogressTask = 0
      var waitTask = 0
      var totalTask = 0
      var deferredTask = 0
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
        } else { deferredTask = deferredTask + 1 }

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
      var donePie: Array<any> = ["Done: " + doneTask, doneTask]
      var waitingPie: Array<any> = ["Waiting: " + waitTask, waitTask]
      var totalPie: Array<any> = ["Total", 0]
      var inProgressPie: Array<any> = ["In progress: " + inprogressTask, inprogressTask]
      var deferredPie: Array<any> = ["Reject: " + deferredTask, deferredTask]
      // console.log(ids)

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
          text: 'Employee\'s tasks progress'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: categories, title: {
            text: 'employee\'s Id'
          }
        },
        yAxis: {
          categories: categories, title: {
            text: 'The volume of tasks'
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
          text: 'The volume of tasks',
          x: 60,
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
          data: [waitingPie, donePie, inProgressPie, deferredPie]
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
    project["startDate"] = `${startDate.getFullYear()}-${startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 : '0' + (startDate.getMonth() + 1)}-${startDate.getDate() > 9 ? startDate.getDate() : '0' + startDate.getDate()}`
    this.projectService.updateProject(project).subscribe()
  }

  decline(project: any) {
    project["status"] = "DEFERRED"
    this.projectService.updateProject(project).subscribe()
  }
  resolve(project: any) {
    project["status"] = "COMPLETED"
    var endDate = new Date()
    project["endDate"] = `${endDate.getFullYear()}-${endDate.getMonth() + 1 > 9 ? endDate.getMonth() + 1 : '0' + (endDate.getMonth() + 1)}-${endDate.getDate() > 9 ? endDate.getDate() : '0' + endDate.getDate()}`
    this.projectService.updateProject(project).subscribe()
  }

  clickShowCreateModal() {
    if (this.modalCreateClass == "modal") {
      this.modalCreateClass = "modal show"
    } else this.modalCreateClass = "modal"
  }

  update(projectData: any) {
    projectData["projectName"] = this.projectForm.value["projectName"]
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
    this.employees = this.employeeService.getAll(0,9999,'firstName','')
  }

  loadPage(page: number) {
    this.currenPage = page
    this.resolvable = true

    this.tasks = this.taskService.findByProject(this.id, page, this.sortField, this.sortDesc)
    this.tasks.subscribe((data: any) => {
      this.resolvable = true
      for (let task of data._embedded.tasks) {
        if (task.status == 'INPROGRESS' || task.status == 'WAITING') {
          this.resolvable = false
        }
      }
    })
    // this.init()
    // this.getAllEmployee()
  }

  counter(i: number) {
    return new Array(i);
  }
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
    this.getTasks(this.id, this.currenPage, this.sortField, this.sortDesc)
  }

  getTaskByStatus(status: any){
    console.log(status)
    this.currentTasksStatus = status.target.value
    
      this.getTasks(this.id, this.currenPage, this.sortField, this.sortDesc)
    
    
    
    // console.log(this.projectsByStatus)
  }

  clickSortStatus(){
    if (this.sortStatusArrow == "fa fa-angle-down") {
      this.sortStatusArrow = "fa fa-angle-up"
      console.log( this.sortStatusArrow = "fa fa-angle-up")
    } else {
      this.sortStatusArrow = "fa fa-angle-down"
      console.log( this.sortStatusArrow = "fa fa-angle-up")
    }
  }

  clickSortCreate(){
    if (this.sortCreatedArrow == "fa fa-angle-down") {
      this.sortCreatedArrow = "fa fa-angle-up"
    } else {
      this.sortCreatedArrow = "fa fa-angle-down"
    }
  }

}

