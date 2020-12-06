import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {

    private subject = new BehaviorSubject<string[]>([]);
    
    // errors$ observable notifies any other part of the application when new values are emitted
    // in our case message component is listening to this errors$ observable
    errors$: Observable<string[]> = this.subject.asObservable()
        .pipe(
            filter(messages => messages && messages.length > 0)
        );

    showErrors(...errors: string[]) {
        // emit new values (error messages)
        this.subject.next(errors);
    }
}
