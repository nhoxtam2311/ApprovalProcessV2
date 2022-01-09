import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(`api/tasks`)
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

  findByProject(projectId: number){
    return this.http.get(`api/tasks/search/findByProject?project=${projectId}`)
  }
  findByParent(parentId: number){
    return this.http.get(`api/tasks/search/findByParent?parent=${parentId}`)
  }

}
