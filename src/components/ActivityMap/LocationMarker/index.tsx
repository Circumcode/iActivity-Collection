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

            let newRouterWay = props.parentState.list.map((item: any) => {
                return [item.latitude, item.longitude]
            })
            newRouterWay.unshift([newHomePosition.latitude, newHomePosition.longitude])
            newRouterWay.push([newHomePosition.latitude, newHomePosition.longitude])

            let newList = props.parentThis.state.list
            newList.unshift(newHomePosition)
            newList.push(newHomePosition)
            buildStationList(newList)
            const distanceAndTime = props.getTotalDistanceOfMeterAndTimeInMinutes(newList)
            if (newList[0].UID === "HOME") newHomePosition.stationData = newList[0].stationData;
            newList = newList.filter((item: any) => item.UID !== "HOME")

            if (props.parentState.isUpdateMap) {
                props.parentThis.setState({
                    isUpdateMap: false,
                    routerWay: [...newRouterWay],
                    list: newList,
                    homePosition: newHomePosition,
                    routerWayTotalDistanceOfMeter: distanceAndTime[0],
                    routerWayTotalTimeInMinutes: distanceAndTime[1]
                })
            } else {
                map.flyTo(event.latlng, map.getZoom())
                props.parentThis.setState({
                    routerWay: [...newRouterWay],
                    list: newList,
                    homePosition: newHomePosition,
                    routerWayTotalDistanceOfMeter: distanceAndTime[0],
                    routerWayTotalTimeInMinutes: distanceAndTime[1]
                })
            }
            ActivityUtils.update(newList)
            setPosition(event.latlng)
        }, locationerror(event: any) {
            let newList = props.parentThis.state.list
            buildStationList(newList)
            const distanceAndTime = props.getTotalDistanceOfMeterAndTimeInMinutes(newList)
            newList = newList.filter((item: any) => item.UID !== "HOME")
            if (newList.length > 1) {
                newList[0].stationData.station = "??????"
                newList[newList.length - 1].stationData = {
                    distanceOfKilometer: 0,
                    distanceOfMeter: 0,
                    distanceToThisStationNeedMeter: 0,
                    estimatedDays: 0,
                    estimatedHours: 0,
                    estimatedMinute: 0,
                    estimatedTimeInMinutes: 0,
                    station: "??????"
                }
            }
            props.parentThis.setState({
                list: newList,
                routerWayTotalDistanceOfMeter: distanceAndTime[0],
                routerWayTotalTimeInMinutes: distanceAndTime[1]
            })
            ActivityUtils.update(newList)
        }
    })

    return position === null ? null : (
        <Marker
            key="HOME"
            icon={mapHomeIcon}
            position={position}>
            <Popup>
                <p className={style.map_dot_home_title}><strong>????????????</strong></p>
                {(props.parentState.homePosition.UID && props.parentState.homePosition.stationData) ? (<div>
                    <strong><p className={style.map_dot_station_title}>????{` ?????? / ??????`}</p></strong>
                    <p className={style.map_dot_station_values}><strong>?????????????????????:</strong> {props.parentState.homePosition.stationData.distanceOfKilometer} ?????? {props.parentState.homePosition.stationData.distanceOfMeter} ??????</p>
                    <p className={style.map_dot_station_values}><strong>????????????????????????:</strong> {(props.parentState.homePosition.stationData.estimatedDays !== 0) ? `${props.parentState.homePosition.stationData.estimatedDays} ??? ` : ""}
                        {(props.parentState.homePosition.stationData.estimatedHours !== 0) ? `${props.parentState.homePosition.stationData.estimatedHours} ?????? ` : ""}
                        {(props.parentState.homePosition.stationData.estimatedMinute !== 0) ? `${props.parentState.homePosition.stationData.estimatedMinute} ?????? ` : ""}</p>
                </div>) : <></>}
                {(props.parentState.routerWayTotalDistanceOfMeter !== 0) ? (<div>
                    <p className={style.space}></p>
                    <p className={style.map_dot_home_values}><strong>?????????????????????????: </strong>
                        {(Math.floor(props.parentState.routerWayTotalDistanceOfMeter / 1000) > 0) ? Math.floor(props.parentState.routerWayTotalDistanceOfMeter / 1000) + " ?????? " : ""}
                        {(Math.floor(props.parentState.routerWayTotalDistanceOfMeter % 1000) > 0) ? Math.floor(props.parentState.routerWayTotalDistanceOfMeter % 1000) + "??????" : ""}
                    </p>
                    <p className={style.map_dot_home_values}><strong>????????????????????????: </strong>
                        {(Math.floor(props.parentState.routerWayTotalTimeInMinutes / 60 / 24) > 0) ? Math.floor(props.parentState.routerWayTotalTimeInMinutes / 60 / 24) + " ??? " : ""}
                        {(Math.floor(props.parentState.routerWayTotalTimeInMinutes / 60 % 24) > 0) ? Math.floor(props.parentState.routerWayTotalTimeInMinutes / 60 % 24) + " ?????? " : ""}
                        {(Math.floor(props.parentState.routerWayTotalTimeInMinutes % 60) > 0) ? Math.floor(props.parentState.routerWayTotalTimeInMinutes % 60) + " ?????? " : ""}
                    </p>
                </div>) : <></>}
            </Popup>
        </Marker>
    )
}