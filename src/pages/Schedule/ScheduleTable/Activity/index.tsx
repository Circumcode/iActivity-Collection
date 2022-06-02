import { CSSProperties, memo } from 'react';

import './antd.css';
import moment from 'moment';
import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import style from './index.module.scss';
import classActivity, { ReservedInfo } from '../../../../tools/Activity'
import Divider from './Divider';
import Weather from './Weather';


const Activity = memo((props: {reservedInfo: ReservedInfo, render: Function, focus: Function, isFocus: boolean}) => {
  const getFormatTime: Function = (event: moment.Moment) => {
    return event.format().split("+")[0];
  }
  const setStartDatePicker: Function = (event: moment.Moment) => {
    let strStartTime: string = "";
    if (event !== null) strStartTime = getFormatTime(event);
    props.reservedInfo.setStartTime( strStartTime );
    props.render();
  }
  const setEndDatePicker: Function = (event: moment.Moment) => {
    let strEndTime: string = "";
    if (event !== null) strEndTime = getFormatTime(event);
    props.reservedInfo.setEndTime( strEndTime );
    props.render();
  }
  const isDisabledStartDate: RangePickerProps['disabledDate'] = (selectionTime) => {
    let dateSelectionTime = new Date(selectionTime.format());
    let strEndTime = props.reservedInfo.getEndTime();
    return ( (dateSelectionTime < new Date()) || ((strEndTime !== "") && (dateSelectionTime > new Date(strEndTime))) );
  }
  const isDisabledEndDate: RangePickerProps['disabledDate'] = (selectionTime) => {
    let dateSelectionTime = new Date(selectionTime.format());
    let strStartTime = props.reservedInfo.getStartTime();
    return ( (dateSelectionTime < new Date()) || ((strStartTime !== "") && (dateSelectionTime < new Date(strStartTime))) );
  }
  // const range: Function = (intStart: number, intEnd: number) => {
  //   let arrNumbers: Array<number> = [];

  //   for (let intNumber = intStart; intNumber < intEnd; intNumber++){
  //     arrNumbers.push(intNumber);
  //   }
  //   return arrNumbers;
  // }
  // const isDisabledStartTime: RangePickerProps['disabledTime'] = (selectionTime) => {
  //   let intHour: number = 24;
  //   let intMinute: number = 60;
  //   let intSecond: number = 60;
  //   if (selectionTime !== null){
  //     let dateSelectionTime = new Date(selectionTime.format());
  //     let dateCurrent = new Date();

  //     if ( (dateSelectionTime.getFullYear() === dateCurrent.getFullYear()) && (dateSelectionTime.getMonth() === dateCurrent.getMonth())
  //       && (dateSelectionTime.getDate() === dateCurrent.getDate()) ){
  //         intHour = dateCurrent.getHours();
  //         intMinute = dateCurrent.getMinutes();
  //         intSecond = dateCurrent.getSeconds();
  //     }
  //   }

  //   return {
  //     disabledHours: () => range(0, intHour),
  //     disabledMinutes: () => range(0, intMinute),
  //     disabledSeconds: () => range(0, intSecond),
  //   }
  // }

  const cancel: React.MouseEventHandler<HTMLImageElement> = (event) => {
    classActivity.cancel(props.reservedInfo.getId());
    props.render();
  }

  
  const cssBackgroundColor: CSSProperties = {
    backgroundColor: "#e0f3ff"
  }
  return (
    <div
      style={props.isFocus? cssBackgroundColor : undefined}
      className={style.div}
      onClick={() => props.focus(props.reservedInfo.getId())}
    >
      <section id={style.title}>
        {props.reservedInfo.activity.title}
      </section>
      <Divider intHeight={50} />

      <section id={style.addressAndTime}>
        <p>{props.reservedInfo.activity.showInfo[0].location}</p>
        <div>
          <DatePicker
            style={{cursor: "pointer"}}

            placement={"bottomLeft"}
            placeholder="Select start time"

            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            value={( (props.reservedInfo.getStartTime() === "")? null : moment(props.reservedInfo.getStartTime(), "YYYY-MM-DD HH:mm:ss") )}
            disabledDate={isDisabledStartDate}
            // disabledTime={isDisabledStartTime}

            onChange={(event) => setStartDatePicker(event)}
          />
          <span id={style.tilde}>~</span>
          <DatePicker
            style={{cursor: "pointer"}}

            placement={"bottomLeft"}
            placeholder="Select end time"

            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            value={( (props.reservedInfo.getEndTime() === "")? null : moment(props.reservedInfo.getEndTime(), "YYYY-MM-DD HH:mm:ss") )}
            disabledDate={isDisabledEndDate}

            onChange={(event) => setEndDatePicker(event)}
          />
        </div>
      </section>
      <Divider intHeight={50} />

      <section id={style.weather}>
        <Weather reservedInfo={props.reservedInfo} />
      </section>
      <Divider intHeight={50} />

      <img
        id={style.btnCross}
        src={require("../../../../assets/icon/cross.png")}
        onClick={cancel}
      />
    </div>
  )
})

export default Activity;
