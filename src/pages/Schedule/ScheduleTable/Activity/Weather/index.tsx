import { memo, useRef } from 'react';

import style from './index.module.scss';
import WeatherAPIUtils from '../../../../../tools/WeatherAPIUtils';


const Weather = memo(() => {
  const isFirstRender = useRef(true);
  if (isFirstRender.current){
    WeatherAPIUtils.getByLocation("高雄市", "燕巢區")
      .then((data) => {
        console.log(data)//
      })
  }


  const elementLoading: JSX.Element = (
    <img src={require("../../../../../assets/icon/load.png")} />
  )
  isFirstRender.current = false;
  return (
    <div className={style.div}>

    </div>
  )
})

export default Weather;
