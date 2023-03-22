import { View, TouchableOpacity, Text } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {
  PROVIDER_GOOGLE,
  Polygon,
  Marker,
  Polyline,
} from 'react-native-maps';
// get gardens
const getGardens = async () => {
  gList = []
  await firestore()
    .collection('gardens')
    .orderBy('created_at', 'desc')
    .get()
    .then(querySnapshot => {
      gList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        data.created_at = String(data.created_at.toDate());
        data.polygon = data.polygon.flat();
        return data;
      });
    })
    .catch(error => {
      console.error(error);
    });
  return gList
}

const Map = () => {
	const [currentPosition, setPosition] = useState({
		latitude: 39.941155726554385,
		longitude: 32.85929029670567,
		latitudeDelta: 0.05,
		longitudeDelta: 0.05,
	});
	
	useEffect(() => {
		Geolocation.getCurrentPosition(pos => {
		const crd = pos.coords;
		setPosition({
			latitude: crd.latitude,
			longitude: crd.longitude,
			latitudeDelta: 0.001,
			longitudeDelta: 0.001,
		});
		});
	}, []);
	
	const [gardens, setGardens] = useState([]);useEffect(() => {
		const fetchData = async () => {
		const data = await getGardens();
		setGardens(data);
		};
		fetchData();
  	}, []);
	const garden_polygons = []
	gardens.forEach(element => {
		garden_polygons.push(element.polygon);
	});
	
	//console.log(garden_polygons)
	return (
    // TODO: konuma en yakın bahçeleri poligon olarak göster.
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{height: '100%'}}>
      <View style={styles.container}>
        <Text style={styles.text}>map</Text>

        {/* TODO: search bar - google cloud gerekli
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          autoFillOnNotFound={true}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: '---',
            language: 'en',
          }}
        /> */}

        <View style={{width: '100%', height: '70%', marginBottom: 15}}>
          <MapView
            style={{width: '100%', height: '100%', marginBottom: 15}}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            initialRegion={currentPosition}></MapView>
        </View>
      </View>
    </LinearGradient>
  );
}


export default Map