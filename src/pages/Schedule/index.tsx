import { memo } from 'react';

import style from './index.module.scss';


const SchedulePage = memo(() => {
  return (
    <div
      className={style.div}
    >
      Schedule
    </div>
  )
})

export default SchedulePage;