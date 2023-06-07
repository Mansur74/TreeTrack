import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import MapView, {PROVIDER_GOOGLE, Polygon, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {getPlantsOfGarden, isInsidePolygon} from '../services/garden_services';
import {insertNewPlant} from '../services/plant_services';
import {setMapPositionByGardenArea} from '../services/helper';
import AutocompleteInput from 'react-native-autocomplete-input';
import { getPlantTypes, insertNewPlantType, searchPlantType } from '../services/plant_type_services';

const SelectPlant = ({navigation}) => {
  const [selectedMapType, setMapType] = useState('standard');
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlantName, setNewPlantName] = useState(null);
  const [newPlantLocation, setNewPlantLocation] = useState(null);
  
  // add new plant
  const addNewPlant = async () => {
    let newPlant = {
      created_at: new Date(),
      name: newPlantName,
      location: newPlantLocation,
      garden_id: selectedGarden.id,
    };
    try {
      // search plant type
      const searchPlantTypeResult = await searchPlantType(selectedPlantType, plantTypes)
      newPlant.plant_type = searchPlantTypeResult.plant_type
      // if new type is inserted, update the list
      setPlantTypes(searchPlantTypeResult.plantTypes)
      const ref_id = await insertNewPlant(newPlant);
      setModalVisible(!modalVisible);
      ToastAndroid.show('New plant is saved.', ToastAndroid.SHORT);
      newPlant = {...newPlant, id: ref_id};
      // console.log('Inserted newPlant: ', newPlant);
      plants.push(newPlant);
      setSelectedPlant(newPlant);
    } catch (error) {
      console.error('add plant err: ', error);
    }
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
  //console.log('============ Current position: ', currentPosition);
  const route = useRoute();

  const selectedGarden = route.params.selectedGarden;
  const [plants, setPlantList] = useState([]);
  // get plants of selected garden
  useEffect(() => {
    const fetchData = async () => {
      setPlantList(await getPlantsOfGarden(selectedGarden.id));
    };
    fetchData();
  }, []);

  const [plantTypes, setPlantTypes] = useState([]); 
  // get plant types
  useEffect(() => {
    const fetchData = async () => {
      setPlantTypes(await getPlantTypes());
    };
    fetchData();
  }, []);

  const handleMapPress = e => {
    e.persist();
    // if pressed point is outside of garden, do not show alert box to add garden
    const isInsideGarden = isInsidePolygon(e.nativeEvent.coordinate, polygon);
    if (isInsideGarden) {
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
    const isInsideGarden = isInsidePolygon(currentPosition, polygon);
    if (isInsideGarden) {
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
    } else {
      ToastAndroid.show(
        'Your current location is not inside of this garden. New plant cannot be inserted.',
        ToastAndroid.LONG,
      );
    }
  };
  /*plants.forEach(element => {
    console.log("=== plant: ", element)
  });*/

  const polygon = selectedGarden.polygon;
  let region = currentPosition;
  if (polygon.length > 2) {
    region = setMapPositionByGardenArea(polygon);
  } else {
    ToastAndroid.show(
      "This garden's area is not declared.",
      ToastAndroid.SHORT,
    );
  }
  let initialMessage = 'You did not select any plant';
  if (plants.length == 0) {
    initialMessage = 'This garden has no plant';
  }
  const [selectedPlant, setSelectedPlant] = useState(null);
  
  const [selectedPlantType, setSelectedPlantType] = useState('');
  const [isHidden, setShowAutoCompleteResult] = useState(true);
  const findPlantTypes = searchText => {
    if (searchText === '') {
      return [];
    }
    const filteredPlantTypes = plantTypes.filter(plantType =>
      plantType.toLowerCase().includes(searchText.toLowerCase()),
    );
    return filteredPlantTypes;
  };

  const handleSelection = item => {
    setSelectedPlantType(item);
    setShowAutoCompleteResult(true);
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
                onPress={() => {
                  setSelectedPlant(plant);
                }}
                style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={{
                    color: 'black',
                    backgroundColor: '#efefef',
                    opacity:
                      selectedPlant && plant.id === selectedPlant.id ? 1 : 0.5,
                  }}>
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
                    opacity:
                      selectedPlant && plant.id === selectedPlant.id ? 1 : 0.4,
                  }}
                />
              </Marker>
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
            marginTop: 5,
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
                      width: '90%',
                      height: isHidden ? 42 : 150,
                      borderWidth: 0,
                      borderRadius: 5,
                      marginBottom: isHidden ? 0 : 30
                  }}>
                    <AutocompleteInput
                      data={findPlantTypes(selectedPlantType)}
                      defaultValue={selectedPlantType}
                      onChangeText={text => {
                        setSelectedPlantType(text);
                        setShowAutoCompleteResult(false);
                      }}
                      hideResults={isHidden}
                      style={{
                        width: '100%',
                        height: 42,
                        paddingStart: 10,
                        paddingEnd: 10,
                        color: '#212121',
                        textAlignVertical: 'top',
                        elevation: 5,
                        fontSize: 16,
                        borderRadius: 5,
                        borderWidth: 0,
                        backgroundColor: "#fff"
                      }}
                      placeholder="Enter plant type"
                      placeholderTextColor={'#21212160'}
                      flatListProps={{
                        keyExtractor: (_, idx) => idx,
                        renderItem: ({item}) => (
                          <TouchableOpacity
                            onPress={() => handleSelection(item)}>
                            <Text
                              style={{
                                borderWidth: 0,
                                padding: 10,
                                color: '#212121',
                              }}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        ),
                      }}
                    />
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
        <TouchableOpacity
          style={styles.button_right}
          onPress={() => {
            navigation.navigate('AddNote', {selectedPlant});
          }}>
          <Text style={styles.bt1}> Select </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SelectPlant;
