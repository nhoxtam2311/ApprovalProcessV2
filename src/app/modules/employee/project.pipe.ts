import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Pipe({
  name: 'project'
})
export class ProjectPipe implements PipeTransform {

  constructor(
    private projectService: ProjectService
  ) { }

  transform(id: number): Observable<any> {
    return this.projectService.getProject(id)
  }

}
