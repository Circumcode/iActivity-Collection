import { memo } from 'react';

import style from './index.module.scss';


const ActivityPage = memo(() => {
  return (
    <footer
      className={style.footer}
    >
      <span>Copyright © circumcode 2022</span>
    </footer>
  )
})

export default ActivityPage;