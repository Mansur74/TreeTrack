import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import MapView, {
  PROVIDER_GOOGLE,
  Polygon,
  Marker,
  Polyline,
} from 'react-native-maps';
import React, {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';

const DrawPolygon = ({navigation, route}) => {
  const onUpdate = route.params && route.params.onUpdate ? route.params.onUpdate : () => {};
  const [selectedMapType, setMapType] = useState('standard');
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
   // keeps pressed locations to draw polygon
   const [coordinates, setCoordinates] = useState([]);
   // adds pressed point to coordinates list
   const handleMapPress = e => {
     // console.log('Map Press event: ', e.nativeEvent.coordinate);
     setCoordinates([...coordinates, e.nativeEvent.coordinate]);
   };
   // asks user to remove this point, when a marker is pressed
   const handleMarkerPress = (coordinate, index) => {
     Alert.alert(
       'Remove Corner',
       `Do you want to remove this corner from garden are?`,
       [
         {
           text: 'Cancel',
           onPress: () => console.log('Cancel Pressed'),
           style: 'cancel',
         },
         {
           text: 'Remove',
           onPress: () => {
             setCoordinates(coordinates.filter(c => c !== coordinate));
           },
         },
       ],
       {cancelable: false},
     );
   };
  return (
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{height: '100%'}}>
      <View style={{padding: 20, flex: 1, marginBottom: 110}}>
        <Text style={styles.text}>add location</Text>

        <Text
          style={{
            fontSize: 15,
            color: '#FFF1DD',
          }}>
          Tab to select corners of your garden
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
            marginBottom: 10,
          }}>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Search..."
            style={{
              height: 40,
              color: '#C4C4C4',
            }}
          />

          <Image
            style={{
              height: 20,
              width: 20,
              marginEnd: 5,
            }}
            source={require('../images/icons/ic_search.png')}></Image>
        </View>

        <View style={{width: '100%', height: '55%', marginBottom: 5}}>
          <MapView
            style={{width: '100%', height: '100%', marginBottom: 15}}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            initialRegion={currentPosition}
            onPress={handleMapPress}
            mapType={selectedMapType}
            >
            {coordinates.map((coordinate, index) => (
              <Marker
                key={index}
                coordinate={coordinate}
                onPress={() => handleMarkerPress(coordinate, index)}
              />
            ))}
            {coordinates.length > 1 && <Polyline coordinates={coordinates} />}
            {coordinates.length > 2 && <Polygon coordinates={coordinates} />}
          </MapView>
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              zIndex: 1,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                borderColor: '#21212130',
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
              }}
              onPress={() => {
                setCoordinates([...coordinates, currentPosition]);
              }}>
              <Text style={{color: '#212121', fontSize: 12, fontWeight: '500'}}>
                Use Current Location
              </Text>
            </TouchableOpacity>
          </View>
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
            <Text style={{color: "white"}}>Standart</Text>
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
            <Text style={{color: "white"}}>Hybrid</Text>
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
            <Text style={{color: "white"}}>Satellite</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button_right}
          onPress={() => {
            navigation.navigate('CreateGarden', {coordinates, onUpdate}); // go back to create page to save garden
          }}>
          <Text style={styles.bt1}> Save Area </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default DrawPolygon;
