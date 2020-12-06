import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

// no providedIn: 'root' is applied, so more than one instance of this service can be available
// in App Component decorator providers section is defined the instance of LoadingService
@Injectable()
export class LoadingService {

    private loadingSubject = new BehaviorSubject<boolean>(false);

    // loading$ is an observable derived from the private field loadingSubject
    // in this way only LoadinService can emit a new value turning on or off the loading component via loadingOn loadingOff 
    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor() {
        console.log('Loading service created ...');
    }

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null) // start a new observable
            .pipe(
                tap(() => this.loadingOn()), // emit a new value (true)
                concatMap(() => obs$), // concat input observable of courses[]
                finalize(() => this.loadingOff()) // finally emit a new value (false)
            );
    }

    loadingOn() {
        // next method allows the loadingSubject to emit a new value (true for loadingOn)
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);
    }
}
