import { memo, useState } from 'react';
import { nanoid } from 'nanoid';

import style from './index.module.scss';
import classActivity from '../../../tools/Activity';
import Activity from './Activity';


const ScheduleTable = memo((props: {renderCounter: number}) => {
  const [intRenderCounter, setRenderCounter] = useState(0);
  const render: Function = () => {
    setRenderCounter(intRenderCounter + 1);
  }

  const arrActivitys: Array<JSX.Element> = [];
  classActivity.getReserved().forEach(reservedInfo => {
    arrActivitys.push(<Activity key={nanoid()} reservedInfo={reservedInfo} render={render} />);
  })

  return (
    <div className={style.div}>
      {arrActivitys}
    </div>
  )
})

export default ScheduleTable;