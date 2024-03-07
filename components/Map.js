import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import MapViewDirections from 'react-native-maps-directions';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Fa5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { selectDestination, selectOrigin } from '../slices/navSlice';
import { GOOGLE_MAPS_API_KEY } from '@env';

const Map = () => {
  const [isOriginPressed, setOriginPressed] = useState(true);
  const [isDestinationPressed, setDestinationPressed] = useState(true);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(10);

  useEffect(() => {
    if (!origin || !destination) return;
    // Zoom and fit to markers
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [origin, destination]);

  useEffect(() => {
    if (origin && destination) {
      fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin.description}&destination=${destination.description}&key=${GOOGLE_MAPS_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          if (data.routes.length) {
            setRouteCoordinates(polyline.decode(data.routes[0].overview_polyline.points));
          }
        });
    }
  }, [origin, destination]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType='mutedStandard'
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onRegionChangeComplete={(region) => {
        let level = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
        setZoomLevel(level);
      }}
    >
      {origin && destination && (
        <MapViewDirections 
          origin={origin.description}
          destination={destination.description}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={10}
          strokeColor='#73C2FB'
        />
      )}
      {routeCoordinates.length > 0 && (
        <>
          <Marker 
            coordinate={{
              latitude: routeCoordinates[0][0],
              longitude: routeCoordinates[0][1],
            }}
            identifier='routeStart'
          >
            <Icon name="certificate" size={20} color='skyblue' />
          </Marker>

          <Marker 
            coordinate={{
              latitude: routeCoordinates[routeCoordinates.length - 1][0],
              longitude: routeCoordinates[routeCoordinates.length - 1][1],
            }}
            identifier='routeEnd'
          >
            <Icon name="circle" size={10} color='white' />
          </Marker>
        </>
      )}

      {origin?.location && (
        <Marker 
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title='Pick up at'
          description={origin.description}
          identifier='origin'
          onPress={() => setOriginPressed(!isOriginPressed)}
        >
          <Icon name="record-vinyl" size={28} color={isOriginPressed ? '#007FFF' : 'gray'} />
        </Marker>
      )}
      
      {destination?.location && (
        <Marker 
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title='Destination'
          description={destination.description}
          identifier='destination'
          onPress={() => setDestinationPressed(!isDestinationPressed)}
        >
          <Icon name="location-dot" size={28} color={isDestinationPressed ? '#CD5C5C' : 'gray'} />
        </Marker>
      )}

      {origin?.location && routeCoordinates.length > 0 && zoomLevel > 15 && (
        <Polyline 
          coordinates={[
            {
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            },
            {
              latitude: routeCoordinates[0][0],
              longitude: routeCoordinates[0][1],
            }
          ]}
          strokeColor='darkgray'
          strokeWidth={2}
          lineDashPattern={[2, 5]}
        />
      )}

      {destination?.location && routeCoordinates.length > 0 && zoomLevel > 15 && (
        <Polyline 
          coordinates={[
            {
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            },
            {
              latitude: routeCoordinates[routeCoordinates.length - 1][0],
              longitude: routeCoordinates[routeCoordinates.length - 1][1],
            }
          ]}
          strokeColor='darkgray'
          strokeWidth={2}
          lineDashPattern={[2, 5]}
        />
      )}
    </MapView>
  );
}

export default Map;