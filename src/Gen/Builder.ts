import { combineLatestWith, concatMap, distinctUntilChanged, from, identity, of, map as rxMap, tap } from 'rxjs';
import { AtomState, AtomStore } from './Atom';
import { IConfigItem, RelationConfig } from './config';
import { path, map, compose, defaultTo } from 'ramda';

const saveAtom: ( name: string, value: AtomState ) => void = ( name, value ) => AtomStore.set( name, value );

// 因为配置项的顺序可能在依赖项的前边，所以先将所有的单状态进行存储，然后再处理依赖关系
const FromConfigItemToAtomStore = ( ConfigItem: IConfigItem ) => {
    const atom = new AtomState<typeof ConfigItem.init>( ConfigItem.init );
    saveAtom( ConfigItem.name, atom );
    return of( ConfigItem );
};

const getAtom: ( name: string ) => AtomState = ( name ) => AtomStore.get( name )!;
const getDependNames: ( ConfigItem: IConfigItem ) => string[] = path( ['depend', 'names'] );
const getDependAtoms: ( ConfigItem: IConfigItem ) => AtomState[] = compose( map( getAtom ), defaultTo( [] ), getDependNames );

// const getStorekey: ( ConfigItem: IConfigItem ) => string = compose( ,getDependNames )

// 处理依赖关系 根据已有的atom state生成新的atom state
const AtomHandle = ( ConfigItem: IConfigItem ) => {
    const atom = getAtom( ConfigItem.name );

    atom.outSubject = atom.inSubject.pipe(
        // 这里处理handle
        rxMap( ConfigItem.handle || identity ),
        distinctUntilChanged()
    );

    return of( ConfigItem );
};

const AtomDependHandle = ( ConfigItem: IConfigItem ) => {

    const atom = getAtom( ConfigItem.name );
    const dependAtoms = getDependAtoms( ConfigItem );

    if ( dependAtoms.length ) {
        atom.outSubject = atom.outSubject.pipe(
            combineLatestWith( ...dependAtoms.map( item => item?.outSubject ) ),
            // tap( ( val ) => console.log( `${ ConfigItem.name } . -- `, val ) ),
            rxMap( ConfigItem?.depend?.handle || identity ),
            distinctUntilChanged()
        );
    }

    return of( ConfigItem );
};

export const BuilderRelation = () => {
    return from( RelationConfig ).pipe(
        concatMap( FromConfigItemToAtomStore ),
        concatMap( AtomHandle ),
        concatMap( AtomDependHandle )
    );
};