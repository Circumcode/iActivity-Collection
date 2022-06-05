import { memo, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import style from './index.module.scss';
import classActivity from '../../../tools/Activity';
import Activity from './Activity';
import ActivityInterval from './ActivityInternal';
import Divider from './Divider';


const ScheduleTable = memo((props: {renderCounter: number}) => {
  const [intRenderCounter, setRenderCounter] = useState(0);
  const render: Function = () => {
    setRenderCounter(intRenderCounter + 1);
  }

  const [strFocusActivityId, setFocusActivityId] = useState("");

  const arrActivitys: Array<JSX.Element> = [];
  let intUpdateDataNumberMinusOne = classActivity.getUpdatedDataNumber() - 1;
  classActivity.getReserved().forEach((reservedInfo, index) => {
    arrActivitys.push(
      <Activity
        key={"Activity_" + reservedInfo.getId()}
        reservedInfo={reservedInfo}
        render={render}
        focus={setFocusActivityId}
        isFocus={strFocusActivityId === reservedInfo.getId()}
      />
    );
    
    if ( reservedInfo.isHavingStationData() && (index < intUpdateDataNumberMinusOne) )
      arrActivitys.push(
        <ActivityInterval
          key={"ActivityInterval_" + reservedInfo.getId()}
          reservedInfo={reservedInfo}
        />
      )
  })


  return (
    <div className={style.div}>
      <article>
        <span id={style.title}>活動名稱</span>
        <Divider isMain={true} intHeight={30} />
        <span id={style.addressAndTime}>活動地址、參與時間</span>
        <Divider isMain={true} intHeight={30} />
        <span id={style.weather}>天氣提示</span>
        <Divider isMain={true} intHeight={30} />
        <span>已選擇活動數量:&nbsp;&nbsp;</span>
        <span>{classActivity.getReservedQuantity()}</span>
      </article>

      {arrActivitys}
    </div>
  )
})

export default ScheduleTable;