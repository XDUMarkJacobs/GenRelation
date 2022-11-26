import { BehaviorSubject, EMPTY, Observable } from 'rxjs';

export class AtomState<T = any> {
    in$: BehaviorSubject<T>;
    mid$: BehaviorSubject<T>;
    out$: BehaviorSubject<T>;

    constructor( init: T ) {
        this.in$ = new BehaviorSubject( init );
        this.mid$ = new BehaviorSubject( init );
        this.out$ = new BehaviorSubject( init );
    }

    get state () {
        return this.out$;
    }
}

export const AtomStore = new Map<string, AtomState>();

export const StateAndCallback = new Map<string, [( val: unknown ) => void, any]>();

export const useStateAndCallback = ( name: string ) => StateAndCallback.get( name )!;
