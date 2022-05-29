import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { MapContainer, Marker, TileLayer, Popup, Polyline } from "react-leaflet";
import React from "react";

import AcitvityUtils from '../../tools/Activity'
import LocationMarker from "./LocationMarker";
import { MapTravel } from './domain/domain'
import FunctionCaller from '../../tools/FunctionCaller'
import calculateRouter from '../../tools/ACO'
import style from './index.module.css'
import { ACOStation } from "../../tools/ACO/domain";



export const FUNCTION_CALLER_KEY_UPDATE_MAP = 'updateMap'
export const FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES = 'drawRouterLines'

const mapTravelIcon = L.divIcon({
  className: style.map_travel_icon,
  iconSize: [20, 15],
  iconAnchor: [0, 0],
  popupAnchor: [10, -30],
});


const mapLineColor = { fillColor: 'blue' }

// interface IProps {
// }

// interface IState {
//   list: MapTravel[],
//   routerWay: L.LatLngExpression[] | L.LatLngExpression[][]
// }

export default class ActivityMap extends React.Component {
  // Default Map setting
  position = [23.835193, 120.997456]
  // position: LatLngExpression = [51.505, -0.09]
  zoom = 5;

  mapRef = React.createRef();
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      routerWay: [],
      a: 1
    }
  }


  drawRouteLines = (resultRoute) => {
    // console.log(resultRoute)
    let newRouterWay = []
    for (const item of resultRoute) {
      const temp = [item.latitude, item.longitude]
      // console.log(temp)
      newRouterWay.push(temp)
    }
    // if (mapRef)
    // console.log(newRouterWay)
    // console.log(this)
    this.setState({ routerWay: [...newRouterWay] })

    // setTimeout(() => {
    //   console.log(this.state)
    // }, 2000)

  }

  updateMap = () => {
    const userReserved = AcitvityUtils.getReserved()
    // console.log(userReserved)
    let maxDistance = [Number.MAX_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, Number.MIN_VALUE]
    let activityInfo = []
    userReserved.map(item => {
      let activity = item.activity
      if (item && activity && activity.showInfo[0] && activity.showInfo[0].latitude && activity.showInfo[0].longitude) {
        const temp = {
          UID: activity.UID,
          title: activity.title,
          sourceWebPromote: activity.sourceWebPromote,
          location: activity.showInfo[0].location,
          latitude: activity.showInfo[0].latitude,
          longitude: activity.showInfo[0].longitude,
          masterUnit: (activity.masterUnit[0]) ? activity.masterUnit[0] : "網站連結"
        }
        maxDistance[0] = Math.max(maxDistance[0], parseFloat(activity.showInfo[0].latitude))
        maxDistance[1] = Math.min(maxDistance[1], parseFloat(activity.showInfo[0].latitude))
        maxDistance[2] = Math.max(maxDistance[2], parseFloat(activity.showInfo[0].longitude))
        maxDistance[3] = Math.min(maxDistance[3], parseFloat(activity.showInfo[0].longitude))
        activityInfo.push(temp);
      }
    })
    // console.log(activityInfo)

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
    setTimeout(() => {
      calculateRouter(AcitvityUtils.getReserved(), 1)
    }, 5000)
    if (!FunctionCaller.hasKey(FUNCTION_CALLER_KEY_UPDATE_MAP)) {
      FunctionCaller.set(FUNCTION_CALLER_KEY_UPDATE_MAP, this.updateMap.bind(this))
    }
    if (!FunctionCaller.hasKey(FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES)) {
      FunctionCaller.set(FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES, this.drawRouteLines.bind(this))
    }


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
          this.state.routerWay.map(item => (
            <Polyline pathOptions={mapLineColor} positions={[item]} />
          ))
        }
        <Polyline pathOptions={mapLineColor} positions={this.state.routerWay} />
        {
          this.state.list.map(item => (
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


