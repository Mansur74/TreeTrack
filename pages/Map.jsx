import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import React, {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {
  PROVIDER_GOOGLE,
  Polygon,
  Marker,
  Polyline,
} from 'react-native-maps';
import {getClosestGarden, getUserGardens} from '../services/garden_services';

const Map = () => {
  const [selectedMapType, setMapType] = useState('standard');
  const [currentPosition, setPosition] = useState({
    latitude: 39.941155726554385,
    longitude: 32.85929029670567,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [searchText, setSearchText] = useState('');
  const [marker, setMarker] = useState(null);

  // günde 2500 arama hakkı var + tam adı yazman gerek + 10 sonuca kadar sonuç veriyor bunlar drop-down search gibi gösterilmeli
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?key=9a8746a80ad44bbd94bb34354802bc5a&q=${searchText}&pretty=1`,
      );
      const data = await response.json();
      console.log('results: ', data.results);
      if (data.results.length > 0) {
        console.log('address: ', data.results[0].formatted);
        console.log('coordinates: ', data.results[0].geometry);
        const {lat, lng} = data.results[0].geometry;
        setMarker({latitude: lat, longitude: lng});
        setPosition({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        console.log('Not found.');
      }
    } catch (error) {
      console.log('error in handle search: ', error);
    }
  };
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

  const [gardens, setGardens] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserGardens();
      setGardens(data);
    };
    fetchData();
  }, []);

	console.log("[map] gardens: ", gardens)
  return (
    // TODO: konuma en yakın bahçeleri poligon olarak göster.
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{height: '100%'}}>
      <View style={styles.container}>
        <Text style={styles.text}>map</Text>

        {/* TODO: search bar - google cloud gerekli*/}
        <TextInput
          style={{
            backgroundColor: '#ffffff95',
            borderRadius: 5,
            marginBottom: 5,
          }}
          placeholder="Search address"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <View style={{width: '100%', height: '60%', marginBottom: 5}}>
          <MapView
            style={{width: '100%', height: '100%'}}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={currentPosition}
            initialRegion={currentPosition}
            mapType={selectedMapType}>
            {marker && <Marker coordinate={marker} />}
            {/* TODO: kullanıcıya en yakın olan bahçeler gösterilecek */}
            {gardens.map(garden => (
              <Polygon
                key={garden.id}
                coordinates={garden.polygon}
                strokeWidth={2}
                fillColor="rgba(167, 255, 200, 0.31)"
              />
            ))}
          </MapView>
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
            onPress={() => setMapType('standard')}
            style={{
              backgroundColor:
                selectedMapType == 'standard' ? '#25596E' : '#09A555',
              paddingHorizontal: 32,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>Standart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMapType('hybrid')}
            style={{
              backgroundColor:
                selectedMapType == 'hybrid' ? '#25596E' : '#09A555',
              paddingHorizontal: 32,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>Hybrid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMapType('satellite')}
            style={{
              backgroundColor:
                selectedMapType == 'satellite' ? '#25596E' : '#09A555',
              paddingHorizontal: 32,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>Satellite</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() =>
            getClosestGarden({
              latitude: 39.918689180427975,
              longitude: 32.85356783839511,
            })
          }
          style={{
            backgroundColor: '#09A555',
            paddingHorizontal: 32,
            paddingVertical: 5,
            borderRadius: 5,
          }}>
          <Text style={{color: 'white'}}>Closest Garden</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Map;
