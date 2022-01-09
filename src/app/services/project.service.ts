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
  getAll() {
    return this.http.get(`api/projects`)
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
  findByStatus(status: String) {
    return this.http.get(`api/projects/search/findByStatus?status=${status}`)
  }
}
