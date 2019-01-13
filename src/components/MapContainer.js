// import React from "react";
// import MyMap from "./MyMap";
// import {  Marker} from "react-google-maps";

// export default class MapContainer extends React.Component {
	
// 	render() {
// 		console.log(this.props);
// 		return (
// 			<div>
// 			<MyMap
// 				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyD_iiWJaeAl0fu3nz_tYhBVA1dBDeUp-QQ&v=3.exp&libraries=geometry,drawing,places`}
// 				loadingElement={<div style={{ height: `100%` }} />}
// 				containerElement={<div style={{ height: `600px`, width: `600px` }} />}
// 				mapElement={<div style={{ height: `100%` }} />}
// 			/>
// 			</div>
// 		);
// 	}
// }
/*global google*/ 
import React from "react";
import SearchField from './SearchField';
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const MapContainer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD_iiWJaeAl0fu3nz_tYhBVA1dBDeUp-QQ&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
		console.log("dsfsdf");
		  const places = refs.searchBox.getPlaces();
		  
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
		  console.log(nextMarkers);
          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
         refs.map.fitBounds(bounds);
        },
	  })
	 
    },
  }),
  withScriptjs,
  withGoogleMap
)(props => <div>
	<SearchField marker = {props.markers}></SearchField>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    defaultCenter ={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
  
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google != undefined ? google.maps.ControlPosition.TOP_LEFT : ''}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Customized your placeholder"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} draggable={true}/>
    )}
  </GoogleMap>
  </div>
);
export default MapContainer;
