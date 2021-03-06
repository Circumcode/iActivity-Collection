import { memo, useRef, useState } from 'react';

import style from './index.module.scss';
import FullWindowMiddle from '../../components/FullWindowMiddle';
import { HeaderEmpty } from '../../components/Header';
import Footer from '../../components/Footer';


const intWaitingTime: number = 7000;

const LoadingPage = memo(() => {
  const isFirstRender = useRef(true);
  const [isOverTime, setOverTimeState] = useState(false);
  const [strLoadingFailureText, setLoadingFailureText] = useState("Sorry... 伺服器繁忙，請稍後再試");
  if (isFirstRender.current){
    if (!navigator.cookieEnabled) {
      setOverTimeState(true);
      setLoadingFailureText("請允許運行 Cookie 以利於使用本系統");
    }
    else
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
    <p className={style.p}>{strLoadingFailureText} &gt;&lt;</p>
  )
  return (
    <>
      <HeaderEmpty />

        <FullWindowMiddle>
          {isOverTime? elementLoadingFailure : elementLoading}
        </FullWindowMiddle>

      <Footer />
    </>
  )
})

export default LoadingPage;