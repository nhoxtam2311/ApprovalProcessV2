import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
  ) { }

  employees!: Observable<any>

  ngOnInit(): void {
    this.pull()
  }

  pull(): void {
    this.employees = this.employeeService.getAll()
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

  create() {
    var employee = this.employeeForm.value
    this.employeeService.create(employee).subscribe(() => {
      
      this.employees.subscribe(() => {
        this.click()
        this.pull()
      })
    })
  }
}
