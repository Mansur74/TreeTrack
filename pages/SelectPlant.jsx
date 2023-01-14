import { View, Text, TouchableOpacity, Dimensions, ToastAndroid, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import React, { useState, useEffect } from 'react';
import {useRoute} from '@react-navigation/native';
import storage from "@react-native-firebase/storage"
import firestore from '@react-native-firebase/firestore';


const getPlantOfGarden = async (garden_id) => {
  const querySnapshot = await firestore()
    .collection('plants')
    .where('garden_id', '==', garden_id)
    .get();
  const plantList = querySnapshot.docs.map(doc => {
    const data = doc.data();
    data.created_at = String(data.created_at.toDate());
    return data;
  });
  return plantList;
};
const SelectPlant = () => {
  const route = useRoute();

  const selectedGarden = route.params.selectedGarden;
  const [plants, setPlantList] = useState([]);
  // get plants of selected garden
  useEffect(() => {
    const fetchData = async () => {
      setPlantList(await getPlantOfGarden(selectedGarden.id));
    };
    fetchData();
  }, []);
  
  /*plants.forEach(element => {
    console.log("=== plant: ", element)
  });*/
  const plantNote = route.params.plantNote;
  const image = route.params.imagePath;

  const polygon = selectedGarden.polygon;

  let initialMessage = 'You did not select any plant';
  if (plants.length == 0) {
    initialMessage = 'This garden has no plant';
  }
  const [selectedPlant, setSelectedPlant] = useState(null);

  const {width, height} = Dimensions.get('window');
  const aspectRatio = width / height;

  const minLatitude = Math.min(...polygon.map(p => p.latitude));
  const maxLatitude = Math.max(...polygon.map(p => p.latitude));
  const minLongitude = Math.min(...polygon.map(p => p.longitude));
  const maxLongitude = Math.max(...polygon.map(p => p.longitude));

  const latitude = (minLatitude + maxLatitude) / 2;
  const longitude = (minLongitude + maxLongitude) / 2;
  const latitudeDelta = maxLatitude - minLatitude;
  const longitudeDelta = (maxLongitude - minLongitude) * aspectRatio;

  const region = {latitude, longitude, latitudeDelta, longitudeDelta};

  const [currentPosition, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
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
  //console.log('Current position: ', currentPosition);
  
  const uploadImage = async(imageUri, folderName) =>{
    const imageRef = storage().ref(`${folderName}/${imageUri.split('/').pop()}`,
    );
    const response = await fetch(imageUri);
    console.log('\nuploadImage response: ', response.status, ' ', response);
    const blob = await response.blob();

    await imageRef.put(blob);
  }

  const getImageUrl = async (folderName, imageName) => {
    const imageRef = storage().ref(`${folderName}/${imageName}`);
    return await imageRef.getDownloadURL();
  }


  const saveNote = async () => {
    if (!selectedPlant) {
      ToastAndroid.show(
        'You must select a plant to save note.',
        ToastAndroid.LONG,
      );
    } else {
      let imageUrl = null
      if(image != null && image.path != null){
        const imageName = image.path.split('/').pop();
        await uploadImage(image.path, 'plants');
        console.log('Image is saved');
        imageUrl = await getImageUrl('plants', imageName);
        console.log('URL of saved image: ', imageUrl);
      }
      else{
        console.log("no image selected")
      }
      const newPlantNote = {
        created_at:  new Date(),
        plant_id: selectedPlant.id,
        note: plantNote,
        image_url: imageUrl
      }
      const newPlantNoteRf = await firestore().collection('plant_notes').add(newPlantNote);
      await newPlantNoteRf.update({id: newPlantNoteRf.id});

      ToastAndroid.show(
        'Plant note for ' + selectedPlant.name + ' is saved.',
        ToastAndroid.LONG,
      );
    }
  };

  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
      <View style={styles.container}>
        <Text style={styles.subtext}> &gt; add photo</Text>
        <Text style={styles.text}>select plant</Text>

        <Text
          style={{
            fontSize: 16,
            color: '#efefef',
            marginBottom: 10,
          }}>
          Select a plant from map by tapping
        </Text>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{width: '100%', height: '45%', marginBottom: 15}}
          showsUserLocation={true}
          initialRegion={region}>
          <Polygon
            coordinates={polygon}
            strokeWidth={2}
            fillColor="rgba(167, 255, 200, 0.31)"
          />
          {plants.map(plant => (
            <Marker
              key={plant.id}
              coordinate={{
                latitude: plant.location.latitude,
                longitude: plant.location.longitude,
              }}
              icon={{
                uri: 'https://cdn-icons-png.flaticon.com/64/685/685025.png', // https://cdn-icons-png.flaticon.com/64/7561/7561338.png
                width: 64,
                height: 64,
              }}
              onPress={() => {
                setSelectedPlant(plant);
              }}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#212121',
                    fontWeight: '400',
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 20,
                  }}>
                  {plant.name}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>

        <TouchableOpacity style={{...styles.button, marginBottom: 15}}>
          {/* TODO: Add new plant dialog */}
          <Text style={styles.bt1}> Add a New Plant </Text>
        </TouchableOpacity>

        <View
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#FFFFFF60',
            alignItems: 'center',
          }}>
          {selectedPlant && (
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                color: '#00000090',
                fontWeight: '500',
              }}>
              {selectedPlant.name}
            </Text>
          )}

          {!selectedPlant && (
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                color: '#00000060',
                fontWeight: '500',
              }}>
              {initialMessage}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.button_right} onPress={saveNote}>
          <Text style={styles.bt1}> Save Note </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SelectPlant;
