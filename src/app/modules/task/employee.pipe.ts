import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';

@Pipe({
  name: 'employee'
})
export class EmployeePipe implements PipeTransform {

constructor(private employeeService: EmployeeService){

}

  transform(id: number): Observable<any> {
    return this.employeeService.getEmployee(id);
  }

}
