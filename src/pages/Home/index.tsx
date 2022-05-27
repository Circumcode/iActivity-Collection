import { memo } from 'react';

import style from './index.module.scss';


const HomePage = memo(() => {
  return (
    <div
      className={style.div}
    >
      Home
    </div>
  )
})

export default HomePage;