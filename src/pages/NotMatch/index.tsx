import { memo } from 'react';

import style from './index.module.scss';
import FullWindowMiddle from '../../components/FullWindowMiddle';
import Footer from '../../components/Footer';
import Header from '../../components/Header';


const NotMatchPage = memo(() => {
  return (
    <>
      <Header />

        <FullWindowMiddle>
            <p className={style.p}>Sorry... 找不到這個頁面 &gt;&lt; (404)</p>
        </FullWindowMiddle>

      <Footer />
    </>
  )
})

export default NotMatchPage;