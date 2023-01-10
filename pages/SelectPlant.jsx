import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import React, { useState, useEffect } from 'react';

const SelectPlant = () => {
  const coordinates = [
    { latitude: 37.8025259, longitude: -122.4351431 },
    { latitude: 37.7896386, longitude: -122.421646 },
    { latitude: 37.7665248, longitude: -122.4275672 },
    { latitude: 37.7734153, longitude: -122.4525175 },
    { latitude: 37.7948605, longitude: -122.4596065 },
  ];

  const [currentPosition, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.001, // zoom map
        longitudeDelta: 0.001,
      });
    });
  }, []);
  console.log("Current position: ", currentPosition)

  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{ height: '100%' }}>
      <View style={styles.container}>
        <Text style={styles.subtext}> &gt; add photo</Text>
        <Text style={styles.text}>Select Plant</Text>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ width: '100%', height: '50%' }}
          showsUserLocation={true}
          initialRegion={currentPosition}>
          <Polygon coordinates={coordinates} />
        </MapView>

        <Text
          style={{
            fontSize: 16,
            color: '#FFF1DD',
            marginTop: 10,
          }}>
          Select a plant from map
        </Text>

        <TouchableOpacity
          style={styles.button}
        >
          <Text style={styles.bt1}> Add a New Plant </Text>
        </TouchableOpacity>


        <View
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            backgroundColor: "#FFFFFF60",
            alignItems: "center",

          }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: "#00000060",
              fontWeight: "500",

            }}>
            Selected Plant's Name
          </Text>
        </View>


        <TouchableOpacity
          style={styles.button_right}
        >
          <Text style={styles.bt1}> Save Photo </Text>
        </TouchableOpacity>

   
      </View>
    </LinearGradient>
  );
};

export default SelectPlant;
