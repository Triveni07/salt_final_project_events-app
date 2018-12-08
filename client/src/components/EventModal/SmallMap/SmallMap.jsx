import React from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  // InfoWindow,
} from 'react-google-maps';

const SmallMap = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCW83YC217OdmY33WAmZqeFGr9DiCfbKAw',
    loadingElement: <div style={{ height: '100%', width: '100%' }} />,
    containerElement: <div style={{ height: '100%', width: '100%' }} />,
    mapElement: <div style={{ height: '100%', width: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)((props) => {
  const { locations } = props;

  let center;
  if (!locations[0].lat || !locations[0].lng) {
    center = {
      lat: 59.3318,
      lng: 18.0634,
    };
  } else {
    center = {
      lat: locations[0].lat,
      lng: locations[0].lng,
    };
  }

  return (
    <GoogleMap
      defaultCenter={{ ...center }}
      defaultZoom={14}
    >
      {locations.map((coordinates) => {
        const { lat, lng } = coordinates;
        if (lat && lng) {
          return <Marker key={Math.floor(Math.random() * Date.now())} position={{ lat, lng }} />;
        }
        return <></>;
      })}
    </GoogleMap>
  );
});

export default SmallMap;
