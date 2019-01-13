import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import MyMarker from "./MyMarker";

const MyMap = withScriptjs(withGoogleMap((props) =>{

  
                  
  return (
      <GoogleMap
        defaultZoom={14}
        center={ { lat:  42.3601, lng: -71.0589 } }
        >
        
      </GoogleMap>
    );
  }
))

export default MyMap;
