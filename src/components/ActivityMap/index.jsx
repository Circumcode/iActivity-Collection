import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { MapContainer, Marker, TileLayer, Popup, Polyline } from "react-leaflet";
import React from "react";

import { nanoid } from 'nanoid'
import pubsub from 'pubsub-js'
import AcitvityUtils from '../../tools/Activity'
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
  zoom = 5;

  mapRef = React.createRef();
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      routerWay: [],
      homePosition: [],
    }
  }

  setHomePosition = (homePosition) => {
    this.setState({ homePosition })
  }

  calculateRouter = () => {
    let listPositions = []
    if (this.state.homePosition.length !== 0) {
      const temp = {
        UID: "HOME",
        latitude: this.state.homePosition[0],
        longitude: this.state.homePosition[1],
      }
      listPositions.push(temp)
    }
    if (this.state.list.length !== 0) {
      this.state.list.map(item => listPositions.push(item))
    }
    ACOCalculateRouter(listPositions)
  }


  drawRouteLines = (_, resultRoute) => {
    let newRouterWay = []
    resultRoute.map(item => {
      const temp = [item.latitude, item.longitude]
      newRouterWay.push(temp)
    })
    // this.setState({ routerWay: [...newRouterWay] })
    // setTimeout(() => console.log(this.state), 1000)

    const tempMap = new Map();
    this.state.list.map(item => tempMap.set(item.UID, item))
    if (this.state.homePosition.length !== 0) {
      let temp = {
        UID: "HOME",
        latitude: this.state.homePosition[0],
        longitude: this.state.homePosition[1],
      }
      tempMap.set(temp.UID, temp)
    }
    resultRoute.map(item => {
      const temp = tempMap.get(item.UID)
      const newItem = {
        ...temp,
        stationData: item
      }
      tempMap.set(item.UID, newItem)
    })

    let tempList = []
    let iterator = tempMap.values();
    let item = iterator.next()
    while (!item.done) {
      tempList.push(item.value)
      item = iterator.next()
    }
    this.setState({ list: [...tempList], routerWay: [...newRouterWay] })
    // setTimeout(()=> console.log(this.state), 1000)
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
          latitude: Number.parseFloat(activity.showInfo[0].latitude),
          longitude: Number.parseFloat(activity.showInfo[0].longitude),
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
    pubsub.subscribe(FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES, this.drawRouteLines)
    pubsub.subscribe(FUNCTION_CALLER_KEY_UPDATE_MAP, this.updateMap)
    pubsub.subscribe(FUNCTION_CALLER_KEY_CALCULATE_ROUTER, this.calculateRouter)
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
        <LocationMarker setHomePosition={this.setHomePosition} />
        {
          this.state.routerWay.map(item => (
            <Polyline key={nanoid()} pathOptions={mapLineColor} positions={[item]} />
          ))
        }
        <Polyline pathOptions={mapLineColor} positions={this.state.routerWay} />
        {
          this.state.list.map(item => (item.UID === "HOME") ? <></> : (
            <Marker icon={mapTravelIcon} key={item.UID} position={[item.latitude, item.longitude]} title={`${item.title}`}>
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


