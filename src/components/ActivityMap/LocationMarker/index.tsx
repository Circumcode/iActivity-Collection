import L from 'leaflet';
import React, { useState } from 'react'
import { Marker, Popup, useMapEvents } from "react-leaflet";

import style from '../index.module.css'
import { buildStationList } from '../../../tools/ACO'
import ActivityUtils from '../../../tools/Activity'

const mapHomeIcon: L.DivIcon = L.divIcon({
    className: style.map_home_icon,
    iconSize: [20, 15],
    iconAnchor: [0, 0],
    popupAnchor: [0, -45],
});


export default function LocationMarker(props: any) {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(event: any) {
            let newHomePosition = {
                UID: "HOME",
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
                stationData: {}
            }

            let newList = props.parentThis.state.list
            newList.unshift(newHomePosition)
            newList.push(newHomePosition)
            buildStationList(newList)
            const distanceAndTime = props.getTotalDistanceOfMeterAndTimeInMinutes(newList)
            if (newList[0].UID === "HOME") newHomePosition.stationData = newList[0].stationData;
            newList = newList.filter((item: any) => item.UID !== "HOME")

            if (props.parentState.isUpdateMap) {
                let newRouterWay = props.parentState.routerWay
                newRouterWay.unshift([newHomePosition.latitude, newHomePosition.longitude])
                newRouterWay.push([newHomePosition.latitude, newHomePosition.longitude])

                props.parentThis.setState({ isUpdateMap: false, 
                    routerWay: [...newRouterWay], 
                    list: newList, 
                    homePosition: newHomePosition, 
                    routerWayTotalDistanceOfMeter: distanceAndTime[0], 
                    routerWayTotalTimeInMinutes: distanceAndTime[1] 
                })
            } else {
                map.flyTo(event.latlng, map.getZoom())
                let newRouterWay = props.parentState.list.map((item: any) => {
                    return [item.latitude, item.longitude]
                })
                newRouterWay.unshift([newHomePosition.latitude, newHomePosition.longitude])
                newRouterWay.push([newHomePosition.latitude, newHomePosition.longitude])

                props.parentThis.setState({ routerWay: [...newRouterWay], 
                    list: newList, 
                    homePosition: newHomePosition, 
                    routerWayTotalDistanceOfMeter: distanceAndTime[0], 
                    routerWayTotalTimeInMinutes: distanceAndTime[1] 
                })
            }
            ActivityUtils.update(newList)
            setPosition(event.latlng)
        },
    })

    return position === null ? null : (
        <Marker
            key="HOME"
            icon={mapHomeIcon}
            position={position}>
            <Popup>
                <p className={style.map_dot_home_title}><strong>當前位置</strong></p>
                {(props.parentState.homePosition.UID && props.parentState.homePosition.stationData) ? (<div>
                    <strong><p className={style.map_dot_station_title}>🚩{` 起點 / 終點`}</p></strong>
                    <p className={style.map_dot_station_values}><strong>估計距離下一站:</strong> {props.parentState.homePosition.stationData.distanceOfKilometer} 公里 {props.parentState.homePosition.stationData.distanceOfMeter} 公尺</p>
                    <p className={style.map_dot_station_values}><strong>估計站點轉移時間:</strong> {(props.parentState.homePosition.stationData.estimatedDays !== 0) ? `${props.parentState.homePosition.stationData.estimatedDays} 天 ` : ""}
                        {(props.parentState.homePosition.stationData.estimatedHours !== 0) ? `${props.parentState.homePosition.stationData.estimatedHours} 小時 ` : ""}
                        {(props.parentState.homePosition.stationData.estimatedMinute !== 0) ? `${props.parentState.homePosition.stationData.estimatedMinute} 分鐘 ` : ""}</p>
                </div>) : <></>}
                {(props.parentState.routerWayTotalDistanceOfMeter !== 0) ? (<div>
                    <p className={style.space}></p>
                    <p className={style.map_dot_home_values}><strong>🏁估計總行程距離: </strong>
                        {(Math.floor(props.parentState.routerWayTotalDistanceOfMeter / 1000) > 0) ? Math.floor(props.parentState.routerWayTotalDistanceOfMeter / 1000) + " 公里 " : ""}
                        {(Math.floor(props.parentState.routerWayTotalDistanceOfMeter % 1000) > 0) ? Math.floor(props.parentState.routerWayTotalDistanceOfMeter % 1000) + "公尺" : ""}
                    </p>
                    <p className={style.map_dot_home_values}><strong>⏱估計總交通時間: </strong>
                        {(Math.floor(props.parentState.routerWayTotalTimeInMinutes / 60 / 24) > 0) ? Math.floor(props.parentState.routerWayTotalTimeInMinutes / 60 / 24) + " 天 " : ""}
                        {(Math.floor(props.parentState.routerWayTotalTimeInMinutes / 60 % 24) > 0) ? Math.floor(props.parentState.routerWayTotalTimeInMinutes / 60 % 24) + " 小時 " : ""}
                        {(Math.floor(props.parentState.routerWayTotalTimeInMinutes % 60) > 0) ? Math.floor(props.parentState.routerWayTotalTimeInMinutes % 60) + " 分鐘 " : ""}
                    </p>
                </div>) : <></>}
            </Popup>
        </Marker>
    )
}