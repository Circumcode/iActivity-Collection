import { memo } from 'react';

import style from './index.module.scss';


const ActivityPage = memo(() => {
  return (
    <div
      className={style.div}
    >
      Activity
    </div>
  )
})

export default ActivityPage;