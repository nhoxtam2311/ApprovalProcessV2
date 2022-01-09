import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';

@Pipe({
  name: 'task'
})
export class TaskPipe implements PipeTransform {

  constructor(private taskService: TaskService){

  }
  
    transform(id: number): Observable<any> {
      return this.taskService.getTask(id);
    }
  

}
