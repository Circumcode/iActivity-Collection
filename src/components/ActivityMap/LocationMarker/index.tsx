import L from 'leaflet';
import React, { useState } from 'react'
import { Marker, Popup, useMapEvents } from "react-leaflet";

import style from '../index.module.css'

const mapHomeIcon: L.DivIcon = L.divIcon({
    className: style.map_home_icon,
    iconSize: [20, 15],
    iconAnchor: [0, 0],
    popupAnchor: [10, -30],
});

export default function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(event: any) {
            setPosition(event.latlng)
            map.flyTo(event.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker
            icon={mapHomeIcon}
            position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}