
import { DatePicker, Radio, Select, Space } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { AtomStore, BuilderRelation } from './Gen';
import { useObservable } from 'rxjs-hooks';


const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const aggregation = [
  { label: '1分钟', value: 60 },
  { label: '5分钟', value: 300 },
  { label: '30分钟', value: 1800 }
];
const shortcut = [
  { label: '10分钟', value: 600, },
  { label: '1小时', value: 3600, },
  { label: '12小时', value: 3600 * 12, }
];

function App () {


  // const short = useObservable( () => AtomStore.get( 'shortcut' )?.outSubject! );
  // const time = useObservable( () => AtomStore.get( 'time' )?.outSubject! );
  // const agg = useObservable( () => AtomStore.get( 'aggregation' )?.outSubject! );

  const [time, setTime] = useState( [] );
  const [short, setShort] = useState( [600] );
  useEffect( () => {
    BuilderRelation().subscribe();
    AtomStore.get( 'time' )?.outSubject!.subscribe( setTime );
    AtomStore.get( 'shortcut' )?.outSubject!.subscribe( setShort );
  }, [] );


  return (
    <div>
      <Space>
        <RadioGroup
          options={ shortcut }
          type='button'
          value={ short }
          onChange={ ( value ) => { AtomStore.get( 'shortcut' )?.inSubject.next( value ); } }
        // value={ short }
        />
        <RangePicker
          showTime={ {
            defaultValue: ['00:00', '04:05'],
            format: 'HH:mm',
          } }
          format='YYYY-MM-DD HH:mm'
          value={ time }
          onChange={ () => { } }
          onSelect={ () => { } }
          onOk={ () => { } }
        />
        <Select
          placeholder='Please select'
          style={ { width: 180 } }
          value={ 60 }
          onChange={ ( value ) => { AtomStore.get( 'aggregation' )?.inSubject.next( value ); } }
        >
          { aggregation.map( ( option, index ) => (
            <Option key={ option.value } value={ option.value }>
              { option.label }
            </Option>
          ) ) }
        </Select>
      </Space>
    </div>
  );
}

export default App;
