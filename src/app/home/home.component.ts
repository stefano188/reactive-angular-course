import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CoursesServices } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(private coursesStore: CoursesStore) {
  }

  ngOnInit() {

    this.reloadCourses()

  }

  /**
   * Stateful loading courses via CoursesStore service
   */
  reloadCourses() {
    this.beginnerCourses$ = this.coursesStore.filterByCategory('BEGINNER');
    this.advancedCourses$ = this.coursesStore.filterByCategory('ADVANCED');
  }

  /**
   * Statless implementation to get the courses
   */
  /* 
  reloadCourses() {

    const courses$ = this.courseService.loadAllCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        // we need to replace the observable failed
        // throwError creates and return immediately a new observable
        return throwError(err);
      })
    );
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$.
      pipe(
        map(courses => courses.filter(course => course.category == 'BEGINNER'))
      );
    this.advancedCourses$ = loadCourses$.
      pipe(
        map(courses => courses.filter(course => course.category == 'ADVANCED'))
      );
    } */

}




