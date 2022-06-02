import { memo, useRef, useState } from 'react';

import style from './index.module.scss';
import { ReservedInfo } from '../../../../../tools/Activity'
import WeatherAPIUtils from '../../../../../tools/WeatherAPIUtils';


const intWaitingTime: number = 7000;

const Weather = memo((props: {reservedInfo: ReservedInfo}) => {
  const isFirstRender = useRef(true);
  const [isLoaded, setLoadedState] = useState(false);
  const [strWeatherTip, setWeatherTip] = useState("請先設定活動起始時間");
  if (isFirstRender.current && !isLoaded){
    let timeoutId = setTimeout(() => {
      if (props.reservedInfo.dateStart !== null){
        setLoadedState(true);
        setWeatherTip("加載氣象局資料逾時");
      }
    }, intWaitingTime)

    WeatherAPIUtils.getByLocation("高雄市", "燕巢區")
      .then((arrWeatherDatas) => {
        clearTimeout(timeoutId);
        setWeatherTip(getWeatherTip(arrWeatherDatas));
        setLoadedState(true);
      })
      .catch((error) => {
        setLoadedState(true);
        setWeatherTip("氣象局資料索取錯誤");
      })
  }

  const getWeatherTip: Function = (arrWeatherDatas: Array<any>) => {
    let intLastIndex = arrWeatherDatas.length - 1;
    let dateStart = props.reservedInfo.dateStart;
    if (dateStart === null) return "請先設定活動起始時間"
    if (dateStart < new Date(arrWeatherDatas[0].startTime)) return "未提供過去時間資料";
    if (dateStart > new Date(arrWeatherDatas[intLastIndex].endTime)) return "未提供超過一星期的資料";

    for (let intIndex = 0; intIndex < intLastIndex; intIndex++){
      if (dateStart < new Date(arrWeatherDatas[intIndex].endTime)) return arrWeatherDatas[intIndex].values.Wx;
    }
  }


  const elementWeather: JSX.Element = (
    <div className={style.div}>
      {strWeatherTip}
    </div>
  )
  const elementLoading: JSX.Element = (
    <img className={style.img} src={require("../../../../../assets/icon/load.png")} />
  )
  isFirstRender.current = false;
  return (
    <>
      {isLoaded? elementWeather : elementLoading}
    </>
  )
})

export default Weather;