import { memo } from 'react';


import style from './index.module.scss';
import classActivity, { ReservedInfo } from '../../../../tools/Activity';
import Divider from './Divider';


const ActivityInterval = memo((props: {reservedInfo: ReservedInfo}) => {

  
  return (
    <div
      className={style.div}
    >
    </div>
  )
})

export default ActivityInterval;
