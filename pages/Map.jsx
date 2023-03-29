import { View, TouchableOpacity, Text } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {
  PROVIDER_GOOGLE,
  Polygon,
  Marker,
  Polyline,
} from 'react-native-maps';
import { getUserGardens } from "../services/garden_services";

const Map = () => {
  const [selectedMapType, setMapType] = useState("standard");
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
		const data = await getUserGardens();
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

        <View style={{width: '100%', height: '70%', marginBottom: 5}}>
          <MapView
            style={{width: '100%', height: '100%'}}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            initialRegion={currentPosition}
            mapType={selectedMapType}></MapView>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            backgroundColor: '#09A555',
            padding: 4,
            borderRadius: 8,
          }}>
          <TouchableOpacity
            onPress={()=>setMapType("standard")}
            style={{
              backgroundColor: selectedMapType == 'standard' ? '#25596E' : '#09A555',
              paddingHorizontal: 32,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Text style={{color: "white"}}>Standart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>setMapType("hybrid")}
            style={{
              backgroundColor: selectedMapType == 'hybrid' ? '#25596E' : '#09A555',
              paddingHorizontal: 32,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Text style={{color: "white"}}>Hybrid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>setMapType("satellite")}
            style={{
              backgroundColor: selectedMapType == 'satellite' ? '#25596E' : '#09A555',
              paddingHorizontal: 32,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Text style={{color: "white"}}>Satellite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}


export default Map