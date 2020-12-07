import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesServices } from '../services/courses.service';

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  // Sigle Data Observable Pattern
  data$: Observable<CourseData>;

  constructor(
      private route: ActivatedRoute,
      private coursesService: CoursesServices) {
  }

  ngOnInit() {
    let courseId = parseInt(this.route.snapshot.paramMap.get('courseId'));

    const course$ = this.coursesService.loadCourseById(courseId)
      .pipe(
        startWith(null)
      );

    const lessons$ = this.coursesService.loadAllCourseLessons(courseId)
      .pipe(
        startWith([])
      );

    // combineLatest emit a value whenerver one of the combined observables emit a value
    // but for the FIRST value combineLatest waits for both the observable to emit the value.
    // From the second value combineLatest will emit the value as soon as one of the observable emit a value
    this.data$ = combineLatest([course$, lessons$])
      .pipe(
        map(([course, lessons]) => {
          return {
            course,
            lessons
          }
        }),
        tap(console.log)
      );
  }

}










