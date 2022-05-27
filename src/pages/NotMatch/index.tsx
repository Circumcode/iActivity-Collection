import { memo } from 'react';

import style from './index.module.scss';


const NotMatchPage = memo(() => {
  return (
    <div
      className={style.div}
    >
      NotMatch
    </div>
  )
})

export default NotMatchPage;