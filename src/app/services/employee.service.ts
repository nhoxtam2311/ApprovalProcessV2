import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient
  ) {}
  getAll(page: number, size: number, sortBy: any, sortDesc: any) {
    return this.http.get(`api/employees?page=${page}&size=${size}&sort=${sortBy},${sortDesc}`)
  }
  create(employee: any) {
    return this.http.post(`api/employees`, employee)
  }
  getEmployee(employeeId: any){
    return this.http.get(`api/employees/${employeeId}`)
  }

  getEmployeeByUserName(userName: any){
    return this.http.get(`api/employees/search/findByUserName?userName=${userName}`)
  }

  updateEmployee(employee: any){
    return this.http.put(`${employee._links.self.href.replace('8080', '4200')}`,employee)
  }
  
}


