import { memo } from 'react';

import style from './index.module.scss';
import FullWindowMiddle from '../../components/FullWindowMiddle';
import { HeaderEmpty } from '../../components/Header';
import Footer from '../../components/Footer';


const NotMatchPage = memo(() => {
  return (
    <>
      <HeaderEmpty />

        <FullWindowMiddle>
            <p className={style.p}>Sorry... 找不到這個頁面 &gt;&lt; (404)</p>
        </FullWindowMiddle>

      <Footer />
    </>
  )
})

export default NotMatchPage;