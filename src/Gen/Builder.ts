import {
	concatMap,
	distinctUntilChanged,
	from,
	identity,
	of,
	map as rxMap,
	tap,
	mergeWith,
	toArray,
	take,
	distinctUntilKeyChanged,
} from "rxjs";
import { AtomState, AtomStore, StateAndCallback, useStateAndCallback } from "./Atom";
import { IConfigItem, RelationConfig } from "./config";
import { path, map, compose, defaultTo } from "ramda";
import { useEventCallback } from "rxjs-hooks";

const saveAtom: ( name: string, value: AtomState ) => void = ( name, value ) => AtomStore.set(
	name,
	value
);

// 因为配置项的顺序可能在依赖项的前边，所以先将所有的单状态进行存储，然后再处理依赖关系
const FromConfigItemToAtomStore = ( ConfigItem: IConfigItem ) => {
	const atom = new AtomState<typeof ConfigItem.init>( ConfigItem.init );
	saveAtom(
		ConfigItem.name,
		atom
	);
	return of( ConfigItem );
};

const getAtom: ( name: string ) => AtomState = ( name ) => AtomStore.get( name )!;
const getDependNames: ( ConfigItem: IConfigItem ) => string[] = path( ["depend", "names"] );
const getDependAtoms: ( ConfigItem: IConfigItem ) => AtomState[] = compose(
	map( getAtom ),
	defaultTo( [] ),
	getDependNames
);

// const getStorekey: ( ConfigItem: IConfigItem ) => string = compose( ,getDependNames )

// 处理依赖关系 根据已有的atom state生成新的atom state
const AtomHandle = ( ConfigItem: IConfigItem ) => {
	const atom = getAtom( ConfigItem.name );

	atom.in$.pipe( // 这里处理handle
		rxMap( ConfigItem.handle || identity ),
		distinctUntilChanged()
	).subscribe( atom.mid$ );

	return of( ConfigItem );
};

const AtomDependHandle = ( ConfigItem: IConfigItem ) => {
	const atom = getAtom( ConfigItem.name );
	const dependAtoms = getDependAtoms( ConfigItem );
	if ( dependAtoms.length ) {
		atom.mid$.pipe(
			mergeWith( ...dependAtoms.map( item => item?.out$ ) ),
			rxMap( ConfigItem?.depend?.handle || identity ),
			distinctUntilChanged( ( cur, pre ) => JSON.stringify( cur ) === JSON.stringify( pre ) ),
		).subscribe( atom.out$ );
	} else {
		atom.mid$.subscribe( atom.out$ );
	}

	return of( ConfigItem );
};

const GenerateStateAndCallback = ( ConfigItem: IConfigItem ) => {

	const atom = getAtom( ConfigItem.name );
	StateAndCallback.set(
		ConfigItem.name,
		useEventCallback(
			( event$ ) => event$.pipe( tap( ( val: any ) => {
				atom.in$.next( val );
			} ) ),
			ConfigItem.init
		)
	);

	return of( ConfigItem );
};

export const BuilderRelation = () => {
	from( RelationConfig ).pipe(
		concatMap( FromConfigItemToAtomStore ),
		take( RelationConfig.length ),
		toArray(),
		concatMap( item => from( item ).pipe(
			concatMap( AtomHandle ),
			concatMap( AtomDependHandle ),
			concatMap( GenerateStateAndCallback )
		) ),
	).subscribe();
	return { useStateAndCallback };
};
