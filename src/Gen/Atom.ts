import { BehaviorSubject, EMPTY, Observable } from 'rxjs';

export class AtomState<T = any> {
    inSubject: BehaviorSubject<T>;
    outSubject: Observable<T>;

    constructor( init: T ) {
        this.inSubject = new BehaviorSubject( init );
        this.outSubject = EMPTY;
    }

    get state () {
        return this.outSubject;
    }
}

export const AtomStore = new Map<string, AtomState>();