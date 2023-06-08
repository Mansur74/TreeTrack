import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import React, {useState, useEffect} from 'react';
import PhotoPick from '../layouts/photo_picker/ImagePicker';
import storage from '@react-native-firebase/storage';
import {insertNewPlant} from '../services/plant_services';
import AutocompleteInput from 'react-native-autocomplete-input';
import {getPlantTypes, searchPlantType} from '../services/plant_type_services';

const CreatePlant = ({route, navigation}) => {
  const onUpdate =
    route.params && route.params.onUpdate ? route.params.onUpdate : () => {};
  const plantLocation =
    route.params && route.params.coordinates ? route.params.coordinates : [];
  const garden = route.params.garden;
  const [plantName, setPlantName] = useState(null);

  const [plantTypes, setPlantTypes] = useState([]);
  // get plant types
  useEffect(() => {
    const fetchData = async () => {
      setPlantTypes(await getPlantTypes());
    };
    fetchData();
  }, []);

  // add plant
  const addPlant = async () => {
      const plantData = {
      name: plantName,
      created_at: new Date(),
      garden_id: garden.id,
      location: plantLocation,
    };
    // TODO: bitki notunu da kaydet?
    try {
      // search plant type
      const searchPlantTypeResult = await searchPlantType(
        selectedPlantType,
        plantTypes,
      );
      plantData.plant_type = searchPlantTypeResult.plant_type;
      // if new type is inserted, update the list
      setPlantTypes(searchPlantTypeResult.plantTypes);
      await insertNewPlant(plantData);
      ToastAndroid.show('Plant is added.', ToastAndroid.SHORT);
      onUpdate();
      navigation.navigate('Plants', {garden});
    } catch (error) {
      console.log('Insert plant error: ', error);
    }
  };

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
      <View style={{padding: 20, flex: 1, marginBottom: 110}}>
        <Text
          style={{
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
            color: '#fff',
          }}>
          {' '}
          {'\u003E'}
          {garden.name}{' '}
        </Text>
        <Text style={styles.text}>add a new plant</Text>
        {/* add plant section */}
        <View>
          <Text style={styles.t4}>Give a name to your plant</Text>
          <TextInput
            value={plantName}
            onChangeText={text => setPlantName(text)}
            placeholderTextColor={'#21212160'}
            placeholder="Plant Name"
            style={{
              width: '100%',
              height: 42,
              paddingStart: 10,
              paddingEnd: 10,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 0,
              color: '#212121',
              textAlignVertical: 'top',
              elevation: 5,
              fontSize: 16,
            }}></TextInput>
          <Text style={styles.t4}>Select plant type</Text>
          <View
            style={{
              width: '100%',
              height: isHidden ? 42 : 150,
              borderWidth: 0,
              borderRadius: 5,
              marginBottom: isHidden ? 0 : 20,
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
                backgroundColor: 'white',
                borderRadius: 10,
                borderWidth: 0,
                color: '#212121',
                textAlignVertical: 'top',
                elevation: 5,
                fontSize: 16,
              }}
              placeholder="Enter plant type"
              placeholderTextColor={'#21212160'}
              flatListProps={{
                keyExtractor: (_, idx) => idx,
                renderItem: ({item}) => (
                  <TouchableOpacity
                    style={{
                      borderWidth: 0,
                      borderRadius: 5,
                    }}
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
        </View>
        <View
          style={{
            padding: 10,
            width: '100%',
          }}>
          <Text style={styles.t4}>Add location of your plant</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                ...styles.button_left,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('AddPlantLocation', {
                  garden,
                  plantName,
                  onUpdate,
                });
              }}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/32/854/854901.png',
                }}
                style={{
                  width: 25,
                  height: 25,
                }}></Image>
              <Text style={{...styles.bt1, color: '#212121', marginLeft: 5}}>
                Open Map
              </Text>
            </TouchableOpacity>
            {plantLocation.length > 2 && (
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/32/8968/8968523.png',
                }}
                style={{
                  width: 38,
                  height: 38,
                }}></Image>
            )}
          </View>
        </View>

        <TouchableOpacity
              style={{...styles.button_right, width: 125}}
              onPress={addPlant}>
              <Text style={{...styles.bt1}}>Add</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default CreatePlant;
