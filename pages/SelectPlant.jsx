import { View, Text, TouchableOpacity, Dimensions, ToastAndroid, Modal, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import React, { useState, useEffect } from 'react';
import {useRoute} from '@react-navigation/native';
import storage from "@react-native-firebase/storage"
import firestore from '@react-native-firebase/firestore';

// TODO: service
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

const plantTypes = [
  {
    plant_type: 'Walnut',
    id: 1,
  },
  {
    plant_type: 'Olive',
    id: 2,
  },
];
const SelectPlant = ({navigation}) => {
  const [selectedMapType, setMapType] = useState("standard");
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlantType, setPickerValue] = useState(plantTypes[0]);
  const [newPlantName, setNewPlantName] = useState(null);
  const [newPlantLocation, setNewPlantLocation] = useState(null)
  const addNewPlant = async () => {
    let newPlant = {
      created_at: new Date(),
      name: newPlantName,
      plant_type: newPlantType,
      location: newPlantLocation,
      garden_id: selectedGarden.id,
    };
    const ref = firestore().collection('plants').doc();
    await ref
      .set({
        id: ref.id,
        location: new firestore.GeoPoint(
          newPlant.location.latitude,
          newPlant.location.longitude,
        ),
        ...newPlant,
      })
      .then(() => {
        setModalVisible(!modalVisible)
        ToastAndroid.show('New plant is saved.', ToastAndroid.SHORT);
        newPlant = {...newPlant, id: ref.id}
        // console.log('Inserted newPlant: ', newPlant);
        plants.push(newPlant)
        setSelectedPlant(newPlant);
      })
      .catch(error => {
        console.error("add plant err: ", error);
      });
  };
  // get current position
  const [currentPosition, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  // current position updated when user moves
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
  console.log('============ Current position: ', currentPosition);
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

  const handleMapPress = (e) => {
    e.persist();
    // if pressed point is outside of garden, do not show alert box to add garden
    const isInsideGarden = isInsidePolygon(e.nativeEvent.coordinate, polygon);
    if(isInsideGarden){
      Alert.alert(
        'Add New Plant',
        `Do you want to add a new plant?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Add',
            onPress: () => {
              setNewPlantLocation(e.nativeEvent.coordinate);
              setModalVisible(true);
            },
          },
        ],
        {cancelable: false},
      );
    }
   
  };
  const handleCurrentLocationPress = () => {
    // check whether current location is inside of garden
    const isInsideGarden = isInsidePolygon(currentPosition, polygon)
    if(isInsideGarden){
      Alert.alert(
        'Add New Plant',
        `Do you want to add a new plant?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Add',
            onPress: () => {
              setNewPlantLocation(currentPosition);
              setModalVisible(true);
            },
          },
        ],
        {cancelable: false},
      );
    }
    else{
      ToastAndroid.show("Your current location is not inside of this garden. New plant cannot be inserted.", ToastAndroid.LONG)
    }
    
  }
  /*plants.forEach(element => {
    console.log("=== plant: ", element)
  });*/
  const plantNote = route.params.plantNote;
  const image = route.params.imagePath;

  const polygon = selectedGarden.polygon;
  let region = currentPosition;
  if (polygon.length > 2) {
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

    region = {latitude, longitude, latitudeDelta, longitudeDelta};
  }
  else{
    ToastAndroid.show("This garden's area is not declared.", ToastAndroid.SHORT)
  }
  let initialMessage = 'You did not select any plant';
  if (plants.length == 0) {
    initialMessage = 'This garden has no plant';
  }
  const [selectedPlant, setSelectedPlant] = useState(null);

  const uploadImage = async (imageUri, folderName) => {
    const imageRef = storage().ref(
      `${folderName}/${imageUri.split('/').pop()}`,
    );
    const response = await fetch(imageUri);
    console.log('\nuploadImage response: ', response.status, ' ', response);
    const blob = await response.blob();

    await imageRef.put(blob);
  };

  const getImageUrl = async (folderName, imageName) => {
    const imageRef = storage().ref(`${folderName}/${imageName}`);
    return await imageRef.getDownloadURL();
  };

  const saveNote = async () => {
    if (!selectedPlant) {
      ToastAndroid.show(
        'You must select a plant to save note.',
        ToastAndroid.LONG,
      );
    } else {
      // upload image to storage and get URL
      let imageUrl = null;
      if (image != null && image.path != null) {
        const imageName = image.path.split('/').pop();
        await uploadImage(image.path, 'plants');
        console.log('Image is saved');
        imageUrl = await getImageUrl('plants', imageName);
        console.log('URL of saved image: ', imageUrl);
      }
      // construct new plant note
      const newPlantNote = {
        created_at: new Date(),
        plant_id: selectedPlant.id,
        note: plantNote,
        image_url: imageUrl,
      };
      const newPlantNoteRf = await firestore()
        .collection('plant_notes')
        .add(newPlantNote);
      await newPlantNoteRf.update({id: newPlantNoteRf.id});

      ToastAndroid.show(
        'Plant note for ' + selectedPlant.name + ' is saved.',
        ToastAndroid.LONG,
      );
      navigation.navigate('AddNote');
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
          Select a plant or tap to map to create new one
        </Text>

        <View style={{width: '100%', height: '50%'}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{width: '100%', height: '100%', marginBottom: 15}}
            showsUserLocation={true}
            initialRegion={region}
            onPress={handleMapPress}
            mapType={selectedMapType}>
            {polygon.length > 2 && (
              <Polygon
                coordinates={polygon}
                strokeWidth={2}
                fillColor="rgba(167, 255, 200, 0.31)"
              />
            )}
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
                style={{alignItems: 'center', justifyContent: 'center'}}
                title={plant.name}></Marker>
            ))}
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
              onPress={handleCurrentLocationPress}>
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
            marginTop: 5
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
        {/* modal for adding new plant */}
        {modalVisible && (
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              visible={modalVisible}
              presentationStyle="fullScreen"
              onRequestClose={() => {
                // console.log('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text
                    style={{
                      color: '#212121',
                      fontSize: 18,
                      fontWeight: '500',
                      marginVertical: 10,
                    }}>
                    {' '}
                    Enter New Plant's Detail
                  </Text>
                  <TextInput
                    value={newPlantName}
                    onChangeText={text => setNewPlantName(text)}
                    placeholderTextColor={'#21212160'}
                    placeholder="Enter Plant Name"
                    style={{
                      borderWidth: 1,
                      borderColor: '#21212150',
                      height: 42,
                      borderRadius: 10,
                      width: '90%',
                      paddingVertical: 8,
                      paddingStart: 10,
                      paddingEnd: 10,
                      color: '#212121',
                      marginVertical: 10,
                    }}></TextInput>
                  {/*plant type picker */}
                  <View
                    style={{
                      ...styles.picker_view,
                      width: '90%',
                      borderWidth: 1,
                      borderColor: '#21212150',
                    }}>
                    <Picker
                      dropdownIconRippleColor={'rgba(202, 255, 222, 0.56)'}
                      dropdownIconColor={'#21212110'}
                      style={{color: '#212121'}}
                      selectedValue={newPlantType}
                      onValueChange={itemValue => {
                        setPickerValue(itemValue);
                      }}>
                      {plantTypes.map(plant_type => (
                        <Picker.Item
                          key={plant_type.id}
                          label={plant_type.plant_type}
                          value={plant_type.plant_type}
                          
                        />
                      ))}
                    </Picker>
                  </View>
                  <View
                    style={{
                      width: '70%',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginVertical: 10,
                    }}>
                    <TouchableOpacity
                      style={{
                        borderColor: '#89C6A7',
                        borderWidth: 2,
                        paddingHorizontal: 25,
                        paddingVertical: 5,
                        borderRadius: 10,
                        marginTop: 15,
                      }}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={{color: '#212121', fontSize: 16}}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#89C6A7',
                        paddingHorizontal: 30,
                        paddingVertical: 5,
                        borderRadius: 10,
                        marginTop: 15,
                      }}
                      onPress={addNewPlant}>
                      <Text style={{color: '#fff', fontSize: 16}}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

        <View
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#FFFFFF60',
            alignItems: 'center',
            marginTop: 20,
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

// Ray Casting algorithm to determine whether a point is inside of given polygon
function isInsidePolygon(point, polygon) {
  let x = point.latitude,
    y = point.longitude;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    let xj = polygon[j].latitude,
      yj = polygon[j].longitude;
    let intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export default SelectPlant;
