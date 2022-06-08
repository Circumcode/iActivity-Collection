import { memo } from 'react';

import style from './index.module.scss';
import { intMinWindowWidth } from '../../components/CheckWindowWidth'
import FullWindowMiddle from '../../components/FullWindowMiddle';
import { HeaderEmpty } from '../../components/Header';
import Footer from '../../components/Footer';


const LoadingPage = memo(() => {
  return (
    <>
      <HeaderEmpty />

        <FullWindowMiddle>
          <p className={style.p}>Sorry... 此系統目前沒有開放手機介面 (螢幕寬度需 &gt; {intMinWindowWidth}px)</p>
        </FullWindowMiddle>

      <Footer />
    </>
  )
})

export default LoadingPage;