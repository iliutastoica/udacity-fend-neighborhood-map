import React, { Component } from 'react';
import axios from 'axios';

/*
 * Instructions on adding and using Google API to React are from here:
 * https://www.youtube.com/watch?v=ywdxLNjhBYw&t=134s
 */

class App extends Component {

  state = {
    map: null,
    allVenues: null,
    filteredVenues: null,
    markers: null,
    selectedMarker: null,
    input: '',
  }

  componentDidMount() {
    this.getAllVenues()
  }

  getAllVenues = () => {
    const endpoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "FA4SYGNXG02SY2UUAGLCWQNWQ12TYIWOYQJO0XZ2FLRIVAPI",
      client_secret: "3PDXYRFCXNYSMISWXT5Y0YQPPALTI1ZUZLTHMETYNE3YCM3G",
      query: "sights",
      ll: "40.7033,-74.0170",
      v: "20182507"
    }

    axios.get(endpoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          allVenues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log('ERROR! ' + error)
      })

  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAEF0NBGLZqmzeUN1uUta4x9hBJf63Pb5g&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7075, lng: -74.01},
      zoom: 16
    })

    this.setState({
      map
    })

    this.createMarkers(map)
  }

  createMarkers = (map) => {
    let venues = this.state.filteredVenues || this.state.allVenues
    let markers = []
    venues.map(venue => {
      let lat = venue.venue.location.lat
      let lng = venue.venue.location.lng
      let marker = new window.google.maps.Marker({
        position: {lat, lng},
        title: venue.venue.name,
        map
      });
      markers.push(marker)
    })
    this.setState({ markers })
  }

  onInputChange = (e) => {
    e.preventDefault()
    this.setState({
      input: e.target.value,
    })
    this.filterMarkers(e.target.value)
  }

  filterMarkers = (input) => {
    let markers = this.state.markers
    let map = this.state.map
    let index = input.length
    markers.map(marker => {
      let markerTitleSubstring = marker.title.toLowerCase().substring(0, index)
      if (markerTitleSubstring === input) {
        marker.setMap(map)
      } else {
        marker.setMap(null)
      }
    })
  }

  render() {
    return (
      <main>
        <div id="search">
          <input type="text" value={this.state.input} onChange={this.onInputChange} />
        </div>
        <div id="buttons">
        </div>
        <div id="map"></div>
      </main>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
