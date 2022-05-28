import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { MapContainer, Marker, TileLayer, Popup, useMapEvents } from "react-leaflet";
import React, { useState } from "react";

import { MapTravel } from './domain/domain'
import style from './index.module.css'

import AcitvityUtils from '../../tools/Activity'


// import '../index.module.scss'
const mapTravelIcon: L.DivIcon = L.divIcon({
  className: style.map_travel_icon,
  iconSize: [20, 15],
  iconAnchor: [0, 0],
  popupAnchor: [15, 0],
});

const mapHomeIcon: L.DivIcon = L.divIcon({
  className: style.map_home_icon,
  iconSize: [20, 15],
  iconAnchor: [0, 0],
  popupAnchor: [15, 0],
});


function LocationMarker() {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e: any) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
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


export default class ActivityMap extends React.Component {
  // Default coordinates set to Oslo central station
  position: LatLngExpression = [59.91174337077401, 10.750425582038146];
  // const position: LatLngExpression = [22.790482, 120.407660];
  zoom: number = 18;

  userReserved = AcitvityUtils.getReserved()
  // console.log(userReserved)
  list: MapTravel[] = [
    {
      productName: "Varm belgisk sjokolade",
      englishProductName: "Belgian hot chocolate",
      vendor: "Steam kaffebar",
      location: "Jernbanetorget 1, Østbanehallen",
      lat: 59.91088362120013,
      lon: 10.752799203777597,
    },
    {
      productName: "Varm sjokolade",
      englishProductName: "Hot chocolate",
      vendor: "Kaffebrenneriet",
      location: "Karl Johans gate 7, Arkaden",
      lat: 59.91181003626315,
      lon: 10.747782602301388,
    },
    {
      productName: "Sjokolade på pinne",
      englishProductName: "Hot chocolate on a stick",
      vendor: "Espresso House",
      location: "Jernbanetorget 1, Østbanehallen",
      lat: 59.91201090441835,
      lon: 10.751298468298101,
      description: "Seasonally available",
    },
  ];




  render() {
    return (
      <MapContainer center={this.position} zoom={this.zoom} scrollWheelZoom={true}>
        <TileLayer
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          // Placeholder, we'll put our markers here
        }
        <LocationMarker />
        {
          this.list.map((item, index) => (
            <Marker
              icon={mapTravelIcon}
              key={index}
              position={[item.lat, item.lon]}
              title={`${item.englishProductName} at ${item.vendor}`}
            >
              <Popup>
                <strong>
                  {item.englishProductName} at {item.vendor}
                </strong>
                <br />
                <p>
                  Look for <strong>{item.productName}</strong> on the menu.
                </p>
                <p>{item.location}</p>
                {item.description && <em>{item.description}</em>}
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    );
  }
}



