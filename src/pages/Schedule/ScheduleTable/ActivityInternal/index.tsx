import { memo } from 'react';


import style from './index.module.scss';
import { ReservedInfo } from '../../../../tools/Activity';
import Divider from '../Divider';


const round: Function = (intNumber: number, intDecimalPointDigit: number) => {
  let intDelta = Math.pow(10, intDecimalPointDigit);
  return Math.round(intNumber * intDelta) / intDelta;
}

const ActivityInterval = memo((props: {reservedInfo: ReservedInfo}) => {
  let stationData = props.reservedInfo.getStationData();


  return (
    <div className={style.div}>
      <div className={style.container}>
        <p>距離下一個站點&nbsp;</p>
        <p id={style.distance}>{round(stationData.distanceToThisStationNeedMeter, 2) + "m"}</p>
        <Divider isMain={false} intHeight={20} />
        <p id={style.time}>{round(stationData.estimatedTimeInMinutes, 2) + "min"}</p>
      </div>
    </div>
  )
})

export default ActivityInterval;
