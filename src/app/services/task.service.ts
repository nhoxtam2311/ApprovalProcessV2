import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getAll(sortBy: any, sortDesc: any){
    return this.http.get(`api/tasks?&sort=${sortBy},${sortDesc}`)
  }

  create(task: any) {
    return this.http.post(`api/tasks`, task)
  }

  getTask(taskId: any){
    return this.http.get(`api/tasks/${taskId}`)
  }

  updateTask(task: any){
    return this.http.put(`${task._links.self.href.replace('8080', '4200')}`,task)
  }

  findByProject(projectId: number, page: number, sortBy: any, sortDesc: any){
    return this.http.get(`api/tasks/search/findByProject?project=${projectId}&page=${page}&size=10&sort=${sortBy},${sortDesc}`)
  }
  findByParent(parentId: number, page: number, sortBy: any, sortDesc: any){
    return this.http.get(`api/tasks/search/findByParent?parent=${parentId}&page=${page}&size=10&sort=${sortBy},${sortDesc}`)
  }
  findByAssignedTo(employeeId: number, page: number, sortBy: any, sortDesc: any){
    return this.http.get(`api/tasks/search/findByAssignedTo?assignedTo=${employeeId}&page=${page}&size=10&sort=${sortBy},${sortDesc}`)
  }
  findByStatus(status: String, sortBy: any, sortDesc: any) {
    return this.http.get(`api/tasks/search/findByStatus?status=${status}&sort=${sortBy},${sortDesc}`)
  }
  findByCreatedDate(year: any, month:any, sortBy:any, sortDesc:any){
    return this.http.get(`api/tasks/search/findByCreatedDateBetween?after=${year}-${month}-01&before=${year}-${month}-31&sort=${sortBy},${sortDesc}`)
  }
  findByProjectFix(projectId: number){
    return this.http.get(`api/tasks/search/findByProject?project=${projectId}`)
  }
  findByParentFix(parentId: number){
    return this.http.get(`api/tasks/search/findByParent?parent=${parentId}`)
  }
}
