import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import axios from 'axios'
import L from 'leaflet'

class Maps extends React.Component {
  constructor() {
    super()
    this.state = {
      hacktiv8: [-6.2648379, 106.7770166],
      markerPoint: {},
      wazePoint: {},
      isMarker: false,
      isWaze: false
    }
    this.IconMarker = L.icon({
        iconUrl: 'http://www.qlue.co.id/vacancy/svc/icon-marker.png',
        iconSize: [30, 30],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });
    this.JamMarker = L.icon({
        iconUrl: 'https://png.icons8.com/material/1600/00897B/traffic-jam',
        iconSize: [25, 25],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });
    this.RoadClosedMarker = L.icon({
        iconUrl: 'http://icons.iconarchive.com/icons/icons8/windows-8/512/Transport-Road-Closure-icon.png',
        iconSize: [25, 25],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });
  }

  componentWillMount() {
    // utk soal nomor 2
    axios.get(`http://www.qlue.co.id/vacancy/svc/getDataExample.php`)
    .then(response => {
      this.setState({
        markerPoint: response.data
      })
    })
  }

  changeMarkerStatus() {
    this.setState({
      isMarker: true
    })
  }

  changeWazeStatus() {
    this.setState({
      isWaze: true,
      isMarker: false
    })
  }

  clearPoint() {
    this.setState({
      isWaze: false,
      isMarker: false
    })
  }

  wazeChange(type) {
    if (type !== 'none') {
      axios.get(`http://waze.qlue.id/jakarta/update/0atxn84I3hx2WmNm5ifPDZkJaLERZD9A.json`)
      .then(response => {
        let alertArr = response.data.alerts
        alertArr = alertArr.filter(alert => alert.type === type)
        this.setState({
          wazePoint: alertArr,
          isWaze: true,
          isMarker: false
        })
      })
    }
  }

  render() {
    return (
      <div>
        <div style={{position: 'fixed', zIndex: 9999999999, marginLeft: 70, marginTop: 20, backgroundColor: 'white', padding: 10}}>
          <div>
            <span style={{marginRight: 10}}>GetData Example</span>
            <button onClick={() => this.changeMarkerStatus()}>Show Terminals</button>
          </div>
          <hr />
          <div>
            <span style={{marginRight: 10}}>Data Waze: </span>
            <select name="alerts" onChange={(e) => this.wazeChange(e.target.value)}>
              <option value="none">Choose type</option>
              <option value="ROAD_CLOSED">ROAD CLOSE</option>
              <option value="JAM">JAM</option>
            </select>
          </div>
          <hr />
          <div>
            <button onClick={() => this.clearPoint()}>Clear</button>
          </div>
        </div>
        <Map center={this.state.hacktiv8} zoom={12}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {this.state.markerPoint.length > 0 && this.state.isMarker === true ? this.state.markerPoint.map(marker => (
            <Marker position={[+marker.lat, +marker.lng]} key={marker.placemark_id} icon={this.IconMarker}>
              <Popup>
                <span>{marker.name}.<br/>{marker.address}.</span>
              </Popup>
            </Marker>
          )) : <div></div> }

          {this.state.wazePoint.length > 0 && this.state.isWaze === true ? this.state.wazePoint.map(alert => (
            <Marker position={[+alert.location.y, +alert.location.x]} key={alert.uuid} icon={alert.type === 'JAM' ? this.JamMarker : this.RoadClosedMarker}>
              <Popup>
                <span>{alert.city}.<br/>{alert.street}.</span>
              </Popup>
            </Marker>
          )) : <div></div> }
        </Map>
      </div>
    )
  }
}

export default Maps