import { memo, useState } from 'react';
import { nanoid } from 'nanoid';

import style from './index.module.scss';
import classActivity from '../../../tools/Activity';
import Activity from './Activity';
import Divider from './Activity/Divider';


const ScheduleTable = memo((props: {renderCounter: number}) => {
  const [intRenderCounter, setRenderCounter] = useState(0);
  const render: Function = () => {
    setRenderCounter(intRenderCounter + 1);
  }

  const [strFocusActivityId, setFocusActivityId] = useState("");

  const arrActivitys: Array<JSX.Element> = [];
  classActivity.getReserved().forEach(reservedInfo => {
    arrActivitys.push(
      <Activity
        key={nanoid()} 
        reservedInfo={reservedInfo}
        render={render}
        focus={setFocusActivityId}
        isFocus={strFocusActivityId === reservedInfo.getId()}
      />
    );
  })


  return (
    <div className={style.div}>
      <article>
        <span id={style.title}>活動名稱</span>
        <Divider intHeight={30} />
        <span id={style.addressAndTime}>活動地址、參與時間</span>
        <Divider intHeight={30} />
        <span id={style.weather}>天氣提示</span>
        <Divider intHeight={30} />
      </article>
      {arrActivitys}
    </div>
  )
})

export default ScheduleTable;