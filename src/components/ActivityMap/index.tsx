import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import React, { RefObject } from "react";

import AcitvityUtils from '../../tools/Activity'
import LocationMarker from "./LocationMarker";
import { MapTravel } from './domain/domain'
import style from './index.module.css'

const mapTravelIcon: L.DivIcon = L.divIcon({
  className: style.map_travel_icon,
  iconSize: [20, 15],
  iconAnchor: [0, 0],
  popupAnchor: [10, -30],
});


interface IProps {
}


interface IState {
  list: MapTravel[],
}

export default class ActivityMap extends React.Component<IProps, IState> {
  // Default Map setting
  position: LatLngExpression = [23.835193, 120.997456]
  zoom: number = 5;

  mapRef: RefObject<L.Map> = React.createRef();
  state = {
    list: [],
  }

  updateMap = () => {
    const userReserved = AcitvityUtils.getReserved()
    let maxDistance = [Number.MAX_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, Number.MIN_VALUE]
    let activityInfo: MapTravel[] = []
    userReserved.map(item => {
      if (item && item.showInfo[0] && item.showInfo[0].latitude && item.showInfo[0].longitude) {
        const temp = {
          UID: item.UID,
          title: item.title,
          sourceWebPromote: item.sourceWebPromote,
          location: item.showInfo[0].location,
          latitude: item.showInfo[0].latitude,
          longitude: item.showInfo[0].longitude,
          masterUnit: (item.masterUnit[0]) ? item.masterUnit[0] : "網站連結"
        }
        maxDistance[0] = Math.max(maxDistance[0], parseFloat(item.showInfo[0].latitude))
        maxDistance[1] = Math.min(maxDistance[1], parseFloat(item.showInfo[0].latitude))
        maxDistance[2] = Math.max(maxDistance[2], parseFloat(item.showInfo[0].longitude))
        maxDistance[3] = Math.min(maxDistance[3], parseFloat(item.showInfo[0].longitude))
        activityInfo.push(temp);
      }
    })

    const interval = setInterval(() => {
      if (this.mapRef.current) {
        window.clearInterval(interval);
        const map = this.mapRef.current
        map.locate()
        let maxDis = 0
        maxDis = Math.max(maxDis, Math.abs(maxDistance[0] - maxDistance[1]))
        maxDis = Math.max(maxDis, Math.abs(maxDistance[2] - maxDistance[3]))
        map.setZoom(Number.parseInt(maxDis + "") * 7)
      }
    }, 300)
    this.setState({ list: [...activityInfo] })
  }

  componentDidMount() {
    this.updateMap()
  }

  render() {
    return (
      <MapContainer
        center={this.position}
        zoom={this.zoom}
        scrollWheelZoom={true}
        ref={this.mapRef}>
        <TileLayer
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {
          this.state.list.map((item: any) => (
            <Marker
              icon={mapTravelIcon}
              key={item.UID}
              position={[item.latitude, item.longitude]}
              title={`${item.title}`}
            >
              <Popup>
                <p>
                  <strong>
                    <a target="_break" href={item.sourceWebPromote}>{item.masterUnit}</a>
                  </strong>
                </p>
                <p>{item.location}</p>
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    );
  }
}


