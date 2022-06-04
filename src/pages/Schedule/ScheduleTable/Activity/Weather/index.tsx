import { memo, useEffect, useRef, useState } from 'react';

import style from './index.module.scss';
import { ReservedInfo } from '../../../../../tools/Activity'
import WeatherAPIUtils from '../../../../../tools/WeatherAPIUtils';


const intWaitingTime: number = 3000;

const Weather = memo((props: {reservedInfo: ReservedInfo, isChangedStartTime: boolean, clearChangedState: Function}) => {
  const isFirstRender = useRef(true);
  const [isLoaded, setLoadedState] = useState(true);
  const [isLoading, setLoadingState] = useState(false);
  const [isFocusPrevious, setFocusPreviousState] = useState(false);
  const [strWeatherTip, setWeatherTip] = useState("");

  const updateWeatherData: Function = () => {
    let strCity: string = props.reservedInfo.activity.showInfo[0].city;

    if (props.reservedInfo.dateStart === null) setWeatherTip("請先設定活動起始時間");
    else if (strCity === null) setWeatherTip("線上活動 (無氣象資訊)");
    else if (!isLoading){
      setLoadedState(false);
      setLoadingState(true);

      let timeoutId = setTimeout(() => {
        setLoadedState(true);
        setLoadingState(false);
        setWeatherTip("加載氣象局資料逾時");
      }, intWaitingTime)

      WeatherAPIUtils.getByLocation(strCity, props.reservedInfo.activity.showInfo[0].area)
        .then((arrWeatherDatas) => {
          setLoadedState(true);
          setLoadingState(false);
          clearTimeout(timeoutId);
          setWeatherTip( getWeatherTip(arrWeatherDatas) );
        })
        .catch((error) => {
          setLoadedState(true);
          setLoadingState(false);
          clearTimeout(timeoutId);
          setWeatherTip("氣象局資料索取錯誤");
        })
    }
  }
  const getWeatherTip: Function = (arrWeatherDatas: Array<any>) => {
    let dateStart = props.reservedInfo.dateStart;
    if (dateStart === null) return "請先設定活動起始時間"
    if (dateStart < new Date(arrWeatherDatas[0].startTime)) return "未提供過去時間資料";
    if (dateStart > new Date(arrWeatherDatas[arrWeatherDatas.length - 1].endTime)) return "未提供超過一星期的資料";

    for (let intIndex = 0; intIndex < arrWeatherDatas.length; intIndex++){
      if (dateStart < new Date(arrWeatherDatas[intIndex].endTime)) 
        return arrWeatherDatas[intIndex].values.Wx;
        // return arrWeatherDatas[intIndex].values.WeatherDescription;
    }
  }
  if (isFirstRender.current) updateWeatherData();
  useEffect(() => {
    if (props.isChangedStartTime && !isFocusPrevious) updateWeatherData();
    setFocusPreviousState(props.isChangedStartTime);
    props.clearChangedState();
  })


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