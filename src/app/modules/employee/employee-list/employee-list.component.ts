import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
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
    emailAddress: new FormControl("emailAddress"),
    bussinessPhone: new FormControl("bussinessPhone"),
    homePhone: new FormControl("homePhone"),
    mobilePhone: new FormControl("mobilePhone"),
    faxNumber: new FormControl("faxNumber"),
    address: new FormControl("address")
  })

  create() {
    var employee = this.employeeForm.value
    this.employeeService.create(employee).subscribe(() => {
      this.pull()
      this.employees.subscribe(() => {
        this.click()
      })
    })
  }
}
