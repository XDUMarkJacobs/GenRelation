import { DatePicker, Radio, Select, Space } from "@arco-design/web-react";
import { useEffect } from "react";
import { useObservable } from "rxjs-hooks";
import { AtomStore, BuilderRelation } from "./Gen";


const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const aggregation = [{
	label: "1分钟",
	value: 60
}, {
	label: "5分钟",
	value: 300
}, {
	label: "30分钟",
	value: 1800
}];
const shortcut = [{
	label: "10分钟",
	value: 600,
}, {
	label: "1小时",
	value: 3600,
}, {
	label: "12小时",
	value: 3600 * 12,
}];

function App() {


	// const short = useObservable( () => AtomStore.get( 'shortcut' )?.outSubject! );
	// const time = useObservable( () => AtomStore.get( 'time' )?.outSubject! );
	// const agg = useObservable( () => AtomStore.get( 'aggregation' )?.outSubject! );
	const { useStateAndCallback } = BuilderRelation();
	// useEffect( () => {
	// AtomStore.get( 'time' )?.outSubject!.subscribe( console.log );
	// }
	// , [] );
	const time = useObservable( () => AtomStore.get( "time" )?.out$! );
	const short = useObservable( () => AtomStore.get( "shortcut" )?.out$! );

	const [timeCallback] = useStateAndCallback( "time" );
	const [shortcutCallback] = useStateAndCallback( "shortcut" );

	return (<div>
			<Space>
				<RadioGroup
					options={ shortcut }
					type="button"
					onChange={ shortcutCallback }
					value={ short }
				/>
				<RangePicker
					showTime={ {
						defaultValue: ["00:00", "04:05"],
						format: "HH:mm",
					} }
					format="YYYY-MM-DD HH:mm"
					value={ time }
					onChange={ timeCallback }
					onSelect={ () => {
					} }
					onOk={ () => {
					} }
				/>
				<Select
					placeholder="Please select"
					style={ { width: 180 } }
					value={ 60 }
					onChange={ ( value ) => {
						AtomStore.get( "aggregation" )?.in$.next( value );
					} }
				>
					{ aggregation.map( ( option, index ) => (<Option key={ option.value } value={ option.value }>
							{ option.label }
						</Option>) ) }
				</Select>
			</Space>
		</div>);
}

export default App;
