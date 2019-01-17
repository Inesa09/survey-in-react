/*global google*/ 
import React from "react";
import Autosuggest from './Autocomplete';
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
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD_iiWJaeAl0fu3nz_tYhBVA1dBDeUp-QQ&v=3&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%`, margin: '0px 30px' }} />,
  }),

  lifecycle({

    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          lat: 41.9, 
          lng: -87.624
        },
        markers: [],
        currentPlace: {},

        writeGoogleCurrentPlace: (googlePlace) => {
          let newPlace = {
            area : null,
            geo_json: null,
            lat: googlePlace.geometry.location.lat().toString(),
            lon: googlePlace.geometry.location.lng().toString(),
            place_id: googlePlace.place_id,
            place_name: googlePlace.name,
            wiki_image: "",
          };
          this.setState({currentPlace: newPlace});
          console.log(newPlace);
        },

        onMapMounted: ref => {
          refs.map = ref;
        },
        onPositionChanged: () => {
          let editPlaces = this.state.updatePlaces();
          this.setState({currentPlace: editPlaces});
        },

        updatePlaces: () => {
          let editedPlace = Object.assign({}, this.state.currentPlace);
          editedPlace.place_name = editedPlace.place_name.startsWith("_edited") ? editedPlace.place_name : ("_edited" + editedPlace.place_name) ;
          const position = refs.marker.getPosition();
          let lat = position.lat().toString();
          let lng = position.lng().toString();
          editedPlace.lat = lat;
          editedPlace.lon = lng;
          this.props.handleAnswer(editedPlace);
          return editedPlace;
        },

        updatePlacesInDB: () => {
          let editedPlace = this.state.updatePlaces();
          return editedPlace;
        },

        onMarkerMounted: ref => {
          refs.marker = ref;
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },

        onPlacesChanged: () => {
		      const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();
          console.log(this.state.currentPlace);
          places.forEach(place => {
            this.state.writeGoogleCurrentPlace(place);
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
          this.setState({center: {nextCenter}, markers: nextMarkers,});
          refs.map.fitBounds(bounds);
          this.props.handleAnswer(this.state.currentPlace);
          console.log("curr", this.state.currentPlace);
        },

        onPlacesChangedAutoCompleate: (newmarkers, newPlace) => {
          console.log(newPlace);
          let newcenter = newmarkers[0].position;
          this.setState({
            currentPlace : newPlace,
            center: newcenter,
            markers: newmarkers,
          }, () =>{
            console.log(this.state.currentPlace);
            this.props.handleAnswer(this.state.currentPlace);
          });
        },

        toggle: (activeBtn, fieldToShow, greyBtn, fieldToHide, ) => {
          document.getElementById(activeBtn).className = 'ui button violet';
          document.getElementById(greyBtn).className = 'ui button active';
          document.getElementById(fieldToShow).style.display = 'block';
          document.getElementById(fieldToHide).style.display = 'none';
        }, 

        clickGoogle: () => {
          this.state.toggle('btnG', 'inputG', 'btnC',  'inputC');
        }, 
      
        clickCustom:  () => {
          this.state.toggle('btnC',  'inputC', 'btnG', 'inputG');
        },

	    })
    },
  }),

  withScriptjs,
  withGoogleMap
)(props => <div >

  <div class="ui buttons" style={{ display: 'flex', justifyContent: 'center', 
    margin: '20px 60px' }}>
    <div class="ui button violet" id='btnG' onClick={props.clickGoogle} >Google</div >
    <div class="or"></div>
    <div  class="ui button active" id='btnC' onClick={props.clickCustom} > Custom </div >
  </div>

  <div id='inputC' style={{display: 'none'}} >
    <Autosuggest 
      placesList = {props.placesList}
      onPlacesChangedAutoCompleate={props.onPlacesChangedAutoCompleate}
    />
  </div>
   
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center = {props.center}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google !== undefined ? google.maps.ControlPosition.TOP_LEFT : ''}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        id='inputG'
        type="text"
        placeholder="Google autosuggest"
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
      <Marker 
        key={index} 
        position={marker.position} 
        draggable={true}
        onPositionChanged={props.onPositionChanged}
        ref={props.onMarkerMounted}
      />
    )}

  </GoogleMap>
</div> );

export default MapContainer;
