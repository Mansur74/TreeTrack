import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
import { setMapPositionByGardenArea } from '../services/helper';
import { getPlantsOfGarden } from '../services/garden_services';

const EditGardenPolygon = ({navigation, route}) => {
  const onUpdate =
    route.params && route.params.onUpdate ? route.params.onUpdate : () => {};
  const garden =
    route.params && route.params.garden ? route.params.garden : {polygon: []};

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
  const [plants, setPlantList] = useState([]);
  // get plants of edited garden
  useEffect(() => {
    const fetchData = async () => {
      setPlantList(await getPlantsOfGarden(garden.id));
    };
    fetchData();
  }, []);
  // keeps pressed locations to draw polygon
  const [coordinates, setCoordinates] = useState(garden.polygon);
  // adds pressed point to coordinates list
  const handleMapPress = e => {
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

  // make initial position to garden's center
  const polygon = garden.polygon;
  let region = currentPosition;
  if (polygon.length > 2) {
    region = setMapPositionByGardenArea(polygon);
  }
  else{
    ToastAndroid.show("This garden's area is not declared.", ToastAndroid.SHORT)
  }

  return (
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{height: '100%'}}>
      <View style={{padding: 20, flex: 1, marginBottom: 110}}>
        <Text style={styles.text}>edit garden area</Text>

        <Text
          style={{
            fontSize: 15,
            color: '#FFF1DD',
          }}>
          Tab corners to remove or 
        </Text>

        <View style={{width: '100%', height: '60%', marginVertical: 5}}>
          <MapView
            style={{width: '100%', height: '100%', marginBottom: 15}}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            initialRegion={region}
            onPress={handleMapPress}
            mapType={selectedMapType}>
            {coordinates.map((coordinate, index) => (
              <Marker
                key={index}
                coordinate={coordinate}
                onPress={() => handleMarkerPress(coordinate, index)}
              />
            ))}
            {plants.map(plant => (
              <Marker
                key={plant.id}
                coordinate={{
                  latitude: plant.location.latitude,
                  longitude: plant.location.longitude,
                }}
                onPress={() => {
                  ToastAndroid.show(
                    'Select another location.',
                    ToastAndroid.LONG,
                  );
                }}
                style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'black', backgroundColor: '#efefef' }}>
                  {plant.name}
                </Text>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/64/685/685025.png',
                  }}
                  resizeMode="stretch"
                  style={{
                    height: 25,
                    width: 25,
                  }}
                />
              </Marker>
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
          style={styles.button_right}
          onPress={() => {
            navigation.navigate('EditGarden', {polygon: coordinates, garden, onUpdate}); // go back to edit garden page
          }}>
          <Text style={styles.bt1}> Save Area </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default EditGardenPolygon;
