import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

/* STATELESS SERVICE */
@Injectable({
    providedIn: 'root' // this indicates that only one instance of CoursesServices will be available for the entire application
})
export class CoursesServices {

    constructor(private httpClient: HttpClient) {

    }

    loadAllCourseLessons(courseId: number): Observable<Lesson[]> {
        return this.httpClient.get('/api/lessons', {
            params: {
                courseId: courseId.toString(),
                pageSize: "1000"
            }
        })
            .pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }

    loadCourseById(courseId: number): Observable<Course> {
        return this.httpClient.get<Course>(`/api/courses/${courseId}`)
            .pipe(
                shareReplay()
            );
    }

    loadAllCourses(): Observable<Course[]> {
        return this.httpClient.get<Course[]>('/api/courses')
            .pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        return this.httpClient.put(`/api/courses/${courseId}`, changes)
            .pipe(
                shareReplay()
            );
    }

    searchLessons(search: string): Observable<Lesson[]> {
        return this.httpClient.get('/api/lessons', {
            params: {
                filter: search,
                pageSize: "100"
            }
        })
            .pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }
}
