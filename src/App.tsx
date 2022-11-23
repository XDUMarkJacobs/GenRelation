
import { DatePicker, Message, Radio, Select, Space } from '@arco-design/web-react';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const agg = ['1分钟', '5分钟', '30分钟', '1小时'];
const shortcut = [
  {
    label: '10分钟',
    value: 600,
  },
  {
    label: '1小时',
    value: 3600,
  },
  {
    value: 3600 * 12,
    label: '12小时'
  }
];

function App () {
  return (
    <div>
      <Space>
        <RadioGroup
          options={ shortcut }
          type='button'
          defaultValue={ 600 }
        />


        <RangePicker
          showTime={ {
            defaultValue: ['00:00', '04:05'],
            format: 'HH:mm',
          } }
          format='YYYY-MM-DD HH:mm'
          onChange={ () => { } }
          onSelect={ () => { } }
          onOk={ () => { } }
        />
        <Select
          placeholder='Please select'
          style={ { width: 154 } }
          onChange={ ( value ) =>
            Message.info( {
              content: `You select ${ value }.`,
              showIcon: true,
            } )
          }
        >
          { agg.map( ( option, index ) => (
            <Option key={ option } value={ option }>
              { option }
            </Option>
          ) ) }
        </Select>

      </Space>
    </div>
  );
}

export default App;
