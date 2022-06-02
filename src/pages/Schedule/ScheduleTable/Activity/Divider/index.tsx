import { memo } from 'react';

import style from './index.module.scss';


const Divider = memo(() => {
  return (
    <div className={style.div}></div>
  )
})

export default Divider;