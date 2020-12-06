import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
    providedIn: 'root'
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http: HttpClient,
        private loading: LoadingService,
        private messages: MessagesService) {
            
            console.log('loading all courses');
            this.loadAllCourses();
    }
    
    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(resp => resp["payload"]),
                catchError(err => {
                    const message = "Could not load courses";
                    this.messages.showErrors(message);
                    console.log(message, err);
                    return throwError(err);
                }),
                // if no error occurs we emit the new courses via subject behavour
                tap(courses => this.subject.next(courses))
            );
        
        this.loading.showLoaderUntilCompleted(loadCourses$)
            .subscribe();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        const courses: Course[] = this.subject.getValue();
        const index = courses.findIndex(course => course.id == courseId);
        const newCourse = {
            ...courses[index],
            ...changes
        };
        
        // copy courses into newCourses
        const newCourses: Course[] = courses.slice(0);

        newCourses[index] = newCourse;

        // emit the new value (the new courses)
        this.subject.next(newCourses);

        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                catchError(err => {
                    const message = 'Could not save the course';
                    console.log(message, err);
                    this.messages.showErrors(message);
                    return throwError(err);
                }),
                shareReplay()
            );
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses => 
                    courses.filter(course => course.category == category)
                        .sort(sortCoursesBySeqNo)
                )
            );
    }
}
