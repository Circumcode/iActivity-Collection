import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import pubsub from 'pubsub-js'
import { MapContainer, Marker, TileLayer, Popup, Polyline } from "react-leaflet";
import React from "react";

import GoogleMapIcon from '../../assets/icon/Google_Maps_icon_335.png'
import WeatherAPIUtils from "../../tools/WeatherAPIUtils";
import ActivityUtils from '../../tools/Activity'
import LocationMarker from "./LocationMarker";
import ACOCalculateRouter from '../../tools/ACO'
import style from './index.module.css'



export const FUNCTION_CALLER_KEY_UPDATE_MAP = 'updateMap'
export const FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES = 'drawRouterLines'
export const FUNCTION_CALLER_KEY_CALCULATE_ROUTER = 'calculateRouter'

const mapTravelIcon = L.divIcon({
  className: style.map_travel_icon,
  iconSize: [20, 15],
  iconAnchor: [0, 0],
  popupAnchor: [0, -45],
});

const mapLineColor = { fillColor: 'blue' }

export default class ActivityMap extends React.Component {
  // Default Map setting
  position = [23.835193, 120.997456]
  // position: LatLngExpression = [51.505, -0.09]
  zoom = 7;

  mapRef = React.createRef();
  state = {
    list: [],
    routerWay: [],
    routerWayTotalDistanceOfMeter: 0,
    routerWayTotalTimeInMinutes: 0,
    homePosition: {},
    weatherMap: new Map(),
    isUpdateMap: false,
  }

  setHomePosition = (homePosition) => {
    this.setState({ homePosition })
  }

  calculateRouter = () => {
    let prepareList = this.state.list.filter(item => item.UID !== "HOME")
    if (this.state.homePosition.UID) {
      prepareList.unshift(this.state.homePosition)
    }
    ACOCalculateRouter(prepareList)
  }
  getTotalDistanceOfMeterAndTimeInMinutes = list => {
    let distanceAndTime = [0, 0]
    for (let i = 0; i < list.length - 1; i++) {
      distanceAndTime[0] += list[i].stationData.distanceToThisStationNeedMeter
      distanceAndTime[1] += list[i].stationData.estimatedTimeInMinutes
    }
    return distanceAndTime
  }

  drawRouteLines = (_, resultRoute) => {
    let newList = []
    let newRouterWay = []
    const distanceAndTime = this.getTotalDistanceOfMeterAndTimeInMinutes(resultRoute)
    if (resultRoute && resultRoute[0] && resultRoute[0].UID === "HOME") {
      resultRoute.map(item => {
        newRouterWay.push([item.latitude, item.longitude])
        if (item.UID !== "HOME") newList.push(item)
      })

    } else {
      resultRoute = resultRoute.slice(0, -1);
      newList = [...resultRoute]
      newRouterWay = resultRoute.map(item => [item.latitude, item.longitude])
      if (newList.length > 1) {
        newList[0].stationData.station = "起點"
        newList[newList.length - 1].stationData = {
          distanceOfKilometer: 0,
          distanceOfMeter: 0,
          distanceToThisStationNeedMeter: 0,
          estimatedDays: 0,
          estimatedHours: 0,
          estimatedMinute: 0,
          estimatedTimeInMinutes: 0,
          station: "終點"
        }
      }
    }

    this.setState({
      list: [...newList],
      routerWay: [...newRouterWay],
      routerWayTotalDistanceOfMeter: distanceAndTime[0],
      routerWayTotalTimeInMinutes: distanceAndTime[1]
    })

    ActivityUtils.update(newList)
  }

  getPromiseWeatherData = (city, area) => {
    return WeatherAPIUtils.getByLocation(city, area)
  }

  updateMap = () => {
    const userReserved = ActivityUtils.getReserved()
    let promiseList = []
    let maxDistance = [Number.MAX_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, Number.MIN_VALUE]
    let activityInfo = []
    let newRouterWay = []

    userReserved.map(item => {
      let activity = item.activity
      if (item && activity && activity.showInfo[0] && activity.showInfo[0].latitude && activity.showInfo[0].longitude) {
        const temp = {
          UID: activity.UID,
          title: activity.title,
          sourceWebPromote: activity.sourceWebPromote,
          location: activity.showInfo[0].location,
          latitude: Number.parseFloat(activity.showInfo[0].latitude),
          longitude: Number.parseFloat(activity.showInfo[0].longitude),
          masterUnit: (activity.masterUnit[0]) ? activity.masterUnit[0] : "網站連結",
          city: activity.showInfo[0].city,
          area: activity.showInfo[0].area
        }
        newRouterWay.push([temp.latitude, temp.longitude])
        promiseList.push(this.getPromiseWeatherData(activity.showInfo[0].city, activity.showInfo[0].area))
        maxDistance[0] = Math.max(maxDistance[0], parseFloat(activity.showInfo[0].latitude))
        maxDistance[1] = Math.min(maxDistance[1], parseFloat(activity.showInfo[0].latitude))
        maxDistance[2] = Math.max(maxDistance[2], parseFloat(activity.showInfo[0].longitude))
        maxDistance[3] = Math.min(maxDistance[3], parseFloat(activity.showInfo[0].longitude))
        activityInfo.push(temp);
      }
    })
    // console.log(activityInfo)
    Promise.all(promiseList).then(values => values.map(item => {
      this.state.weatherMap.set(item[0].city + item[0].area, item)
      this.setState({})
    }))

    this.setState({ list: [...activityInfo], routerWay: [...newRouterWay], isUpdateMap: true })
    // setTimeout(() => console.log(this.state))

    const interval = setInterval(() => {
      if (this.mapRef.current) {
        window.clearInterval(interval);
        const map = this.mapRef.current
        map.locate()
        // let avgLat = (maxDistance[0]/2 + maxDistance[1]/2)
        // let avgLon = (maxDistance[2]/2 + maxDistance[3]/2)
        // map.setView([avgLat, avgLon], 7)
      }
    }, 300)
  }

  mappingToGoogleMap = () => {
    // https://www.google.com.tw/maps/dir/22.8092071,120.287032/22.808081,120.281519/22.8339171,120.2453587/data=!4m2!4m1!3e0?hl=zh-TW
    const urlHead = "https://www.google.com.tw/maps/dir/"
    const urlLast = "data=!3m1!4b1!4m2!4m1!3e0?hl=zh-TW"
    let url = urlHead
    this.state.routerWay.map(item => {
      url += `${item[0]},${item[1]}/`
    })
    url += urlLast
    window.open(url, "_black")
  }

  componentDidMount() {
    pubsub.unsubscribe(FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES)
    pubsub.unsubscribe(FUNCTION_CALLER_KEY_UPDATE_MAP)
    pubsub.unsubscribe(FUNCTION_CALLER_KEY_CALCULATE_ROUTER)

    pubsub.subscribe(FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES, this.drawRouteLines)
    pubsub.subscribe(FUNCTION_CALLER_KEY_UPDATE_MAP, this.updateMap)
    pubsub.subscribe(FUNCTION_CALLER_KEY_CALCULATE_ROUTER, this.calculateRouter)

    this.updateMap()
  }

  render() {
    return (
      <div className={style.div}>
        <div className={style.map_mapping_to_google_map_but} onClick={this.mappingToGoogleMap}>
          <img className={style.googleMapIcon} src={GoogleMapIcon} />
        </div>
        <MapContainer
          center={this.position}
          zoom={this.zoom}
          scrollWheelZoom={true}
          ref={this.mapRef}>
          <TileLayer
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker parentState={this.state} parentThis={this} getTotalDistanceOfMeterAndTimeInMinutes={this.getTotalDistanceOfMeterAndTimeInMinutes} />
          <Polyline pathOptions={mapLineColor} positions={this.state.routerWay} />
          {
            this.state.list.map(item => (item.UID === "HOME") ? <></> : (
              <Marker key={item.UID} icon={mapTravelIcon} position={[item.latitude, item.longitude]} title={`${item.title}`}>
                <Popup>
                  <p className={style.map_dot_title_link}><strong><a target="_break" href={item.sourceWebPromote}>{item.title}</a></strong></p>
                  <p className={style.map_dot_title_location}><strong>📬地址:</strong> {item.location}</p>
                  {(this.state.weatherMap.has(item.city + item.area)) ? (<div><p className={style.map_icon_sun}></p>
                    <strong><p className={style.map_today_weather_title}>今日氣象</p></strong>
                    <p className={style.map_today_weather_values}><strong>降雨機率:</strong> 🌧{this.state.weatherMap.get(item.city + item.area)[0].values.PoP12h}%</p>
                    <p className={style.map_today_weather_values}><strong>天氣狀況:</strong> {this.state.weatherMap.get(item.city + item.area)[0].values.Wx}</p>
                  </div>) : <></>}
                  {
                    (item.stationData) ? (<div>
                      <strong><p className={style.map_dot_station_title}>🚩{(isNaN(item.stationData.station) ? item.stationData.station : `第 ${item.stationData.station} 站`)}</p></strong>
                      <p className={style.map_dot_station_values}>{(item.stationData.distanceToThisStationNeedMeter != 0) ?
                        <span>
                          <strong>估計距離下一站:</strong>
                          {(item.stationData.distanceOfKilometer !== 0) ? `${item.stationData.distanceOfKilometer} 公里` : ""}
                          {(item.stationData.distanceOfMeter !== 0) ? `${item.stationData.distanceOfMeter} 公尺` : ""}
                        </span> : <></>}</p>
                      <p className={style.map_dot_station_values}>{(item.stationData.estimatedTimeInMinutes != 0) ?
                        <span>
                          <strong>估計站點轉移時間:</strong>
                          {(item.stationData.estimatedDays !== 0) ? `${item.stationData.estimatedDays} 天 ` : ""}
                          {(item.stationData.estimatedHours !== 0) ? `${item.stationData.estimatedHours} 小時 ` : ""}
                          {(item.stationData.estimatedMinute !== 0) ? `${item.stationData.estimatedMinute} 分鐘 ` : ""}
                        </span> : <></>}</p>
                    </div>) : <></>
                  }
                </Popup>
              </Marker>
            ))
          }
        </MapContainer>
      </div>
    );
  }
}


