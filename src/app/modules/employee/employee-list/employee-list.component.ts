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
}
