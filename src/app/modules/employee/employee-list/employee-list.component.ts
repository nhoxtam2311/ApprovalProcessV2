import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthorService } from 'src/app/services/author-service.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private authorService: AuthorService
  ) { }

  employees!: Observable<any>
  author!: Observable<any>

  sortBy: any
  sortDesc = ''
  sortBool:Boolean = true
  sortField ='firstName'
  currenPage: number = 0
  totalPages: number = 0
  

  ngOnInit(): void {
    this.pull()
    this.getAuthor()
  }

  pull(): void {
    this.employees = this.employeeService.getAll(0,18,this.sortField,this.sortDesc)
    this.employees.subscribe((data:any)=>{
      this.totalPages = data.page.totalPages
    })
  }

  getAuthor(){
    this.author = this.authorService.getAll()
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
    userName: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    company: new FormControl(),
    jobTitle: new FormControl(),

    bussinessPhone: new FormControl(),
    homePhone: new FormControl(),
    mobilePhone: new FormControl(),
    faxNumber: new FormControl(),

    street: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
    zip: new FormControl(),
    country: new FormControl(),

    emailAddress: new FormControl(),
  })

  create() {
    var employee = this.employeeForm.value
    this.employeeService.create(employee).subscribe(() => {
      
      this.employees.subscribe(() => {
        this.click()
        this.pull()
      })
    })
  }

  loadPage(page: number) {
    this.currenPage = page

    this.employees = this.employeeService.getAll(page, 18, this.sortField, this.sortDesc)
    
    // this.init()
    // this.getAllEmployee()
  }

  counter(i: number) {
    return new Array(i);
  }
  sortEmployeeBy(field: any) {
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
    this.employees = this.employeeService.getAll(this.currenPage, 18, this.sortField, this.sortDesc)
  }

}
