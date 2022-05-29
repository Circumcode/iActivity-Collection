import { memo, useRef, useState } from 'react';

import style from './index.module.scss';
import FullWindowMiddle from '../../components/FullWindowMiddle';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


const intWaitingTime: number = 7000;

const LoadingPage = memo(() => {
  const isFirstRender = useRef(true);
  const [isOverTime, setOverTimeState] = useState(false);
  if (isFirstRender.current){
    setTimeout(() => {
      setOverTimeState(true);
    }, intWaitingTime)
  }


  isFirstRender.current = false;
  const elementLoading: JSX.Element = (
    <div className={style.div}>
      <img src={require("../../assets/icon/load.png")} />
    </div>
  )
  const elementLoadingFailure = (
    <p className={style.p}>Sorry... 伺服器繁忙，請稍後再試 &gt;&lt;</p>
  )
  return (
    <>
      <Header />

        <FullWindowMiddle>
          {isOverTime? elementLoadingFailure : elementLoading}
        </FullWindowMiddle>

      <Footer />
    </>
  )
})

export default LoadingPage;