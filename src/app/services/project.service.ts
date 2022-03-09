import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient
    ) {
  }
  getAll(sortBy: any, sortDesc: any) {
    return this.http.get(`api/projects?&sort=${sortBy},${sortDesc}`)
  }
  create(project: any) {
    return this.http.post(`api/projects`, project)
  }
  getProject(projectId: any) : Observable<any>{
    return this.http.get(`api/projects/${projectId}`)
  }
  
  updateProject(project: any){
    return this.http.put(`${project._links.self.href.replace('8080', '4200')}`,project)
  }
  findByStatus(status: String, sortBy: any, sortDesc: any) {
    return this.http.get(`api/projects/search/findByStatus?status=${status}&sort=${sortBy},${sortDesc}`)
  }
  findByOwner(employeeId: String, page: number, sortBy: any, sortDesc: any) {
    return this.http.get(`api/projects/search/findByOwner?owner=${employeeId}&page=${page}&size=10&sort=${sortBy},${sortDesc}`)
  }
}
