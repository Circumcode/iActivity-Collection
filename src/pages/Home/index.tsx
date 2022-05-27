import { memo } from 'react';

import style from './index.module.scss';
import SlideShow from './slide/index.js';

const HomePage = memo(() => {
  return (
    <>
      <div className={style.titlebar}>
        <img src="" alt="" />
      </div>
      <div className={style.slideShow}>
        <SlideShow></SlideShow>
      </div>
    </>
  )
})

export default HomePage;