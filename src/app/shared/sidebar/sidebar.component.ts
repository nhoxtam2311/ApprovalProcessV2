import { Component, OnInit } from '@angular/core';
import {  } from '@fortawesome/fontawesome-svg-core';
import { Observable } from 'rxjs';
import { AuthorService } from 'src/app/services/author-service.service';
import { EmployeeService } from 'src/app/services/employee.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private authorService: AuthorService
  ) { }

  employee!: Observable<any>
  user!: Observable<any>
  userName: any
  id: any

  ngOnInit(): void {
    this.getAuthor()
  }
  getEmployeeByUserName(username:any){
     return this.employeeService.getEmployeeByUserName(username)
    // console.log(this.employee)
  }
  getAuthor(){
    this.user = this.authorService.getAll()
    this.user.subscribe((data:any)=>{
      this.userName = data.name
      this.employee = this.getEmployeeByUserName(data.name)
      this.employee.subscribe((employee:any)=>{
        this.id = employee._embedded.employees[0].id
        console.log(this.id)
      })
      // console.log(this.userName)
    })
  }
}
