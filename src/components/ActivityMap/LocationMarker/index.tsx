import L from 'leaflet';
import React, { useState } from 'react'
import { Marker, Popup, useMapEvents } from "react-leaflet";

import style from '../index.module.css'

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
            setPosition(event.latlng)
            props.setHomePosition([event.latitude, event.longitude])
            if (props.parentState.isUpdateMap) {
                // console.log(event.latlng)
                const temp = [event.latlng.lat, event.latlng.lng]
                let newRouterWay = props.parentState.routerWay
                newRouterWay.unshift(temp)
                newRouterWay.push(temp)
                // console.log(newRouterWay)
                props.parentThis.setState({ isUpdateMap: false, routerWay: [...newRouterWay] })
            } else {
                map.flyTo(event.latlng, map.getZoom())
            }
        },
    })

    return position === null ? null : (
        <Marker
            key="HOME"
            icon={mapHomeIcon}
            position={position}>
            <Popup>
                <p className={style.map_dot_home_title}><strong>當前位置</strong></p>
                {(props.parentState.routerWayTotalDistanceOfMeter !== 0) ? (<div>
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