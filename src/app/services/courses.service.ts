import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";

@Injectable({
    providedIn: 'root' // this indicates that only one instance of CoursesServices will be available for the entire application
})
export class CoursesServices {

    constructor(private httpClient: HttpClient) {

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
}
