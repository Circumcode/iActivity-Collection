import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';

import 'antd/dist/antd.css';
import moment from 'moment';
import { DatePicker, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';


const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

console.log(moment("20220529", "YYYYMMDD"))
console.log(moment().endOf('day'));
const disabledDate: RangePickerProps['disabledDate'] = current => {
  // Can not select days before today and today
  return current && (current > moment("20220620", "YYYYMMDD").add(1, 'days') ||  current < moment().endOf('day').subtract(1, "days"));
};

const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).splice(4, 20),
  disabledMinutes: () => range(30, 60),
  disabledSeconds: () => [55, 56],
});


class Test extends Component {
  
  dateChange = (event: any) =>{
    if(event){
      console.log(event.format())
    }
  }

  render() {
    return (
      <div>
        {/* <Space direction="vertical" size={12}> */}
          <DatePicker
            onChange={this.dateChange}
            placement={"bottomLeft"}
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        {/* </Space> */}
      </div>
    )
  }
}

export default Test;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Test />
);
