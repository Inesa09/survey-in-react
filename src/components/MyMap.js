import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, SearchBox} from "react-google-maps";
import MyMarker from "./MyMarker";

const MyMap = withScriptjs(withGoogleMap((props) =>{
    console.log(props);
  return (
    <div>
    
      <GoogleMap
        defaultZoom={14}
        center={ { lat:  42.3601, lng: -71.0589 } }>
        
      </GoogleMap>
      <Marker
        position={{ lat:  42.3601, lng: -71.0589 }}
        >
          
        </Marker>
     </div>
    );
  }
))

export default MyMap;
