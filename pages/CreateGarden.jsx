import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ToastAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import React, {useState} from 'react';
import PhotoPick from '../layouts/photo_picker/ImagePicker';
import storage from '@react-native-firebase/storage';
import {insertGarden} from '../services/garden_services';
import AutocompleteInput from 'react-native-autocomplete-input';

// fake data - TODO: retrieve from API
const gardenTypeList = [
  'Farm',
  'Container Garden',
  'Ferennial garden',
  'Rose garden',
  'Water garden',
];
const CreateGarden = ({route, navigation}) => {
  const onUpdate =
    route.params && route.params.onUpdate ? route.params.onUpdate : () => {};
  const polygon =
    route.params && route.params.coordinates ? route.params.coordinates : [];
  const [gardenName, setGardenName] = useState(null);

  // add garden
  const addGarden = async () => {
    const gardenData = {
      name: gardenName,
      created_at: new Date(),
      polygon: polygon,
      garden_type: selectedGardenType,
    };
    // TODO: bahçe notunu da kaydet?
    try {
      await insertGarden(gardenData);
      ToastAndroid.show('Garden is saved.', ToastAndroid.SHORT);
      onUpdate();
      navigation.navigate('Gardens');
    } catch (error) {
      console.log('Insert garden error: ', error);
    }
  };

  const [gardenTypes, setGardenTypes] = useState(gardenTypeList); // Example garden types
  const [selectedGardenType, setSelectedGardenType] = useState('');
  const [isHidden, setShowAutoCompleteResult] = useState(true);
  const findGardenTypes = searchText => {
    if (searchText === '') {
      return [];
    }
    const filteredGardenTypes = gardenTypes.filter(gardenType =>
      gardenType.toLowerCase().includes(searchText.toLowerCase()),
    );
    return filteredGardenTypes;
  };

  const handleSelection = item => {
    setSelectedGardenType(item);
    setShowAutoCompleteResult(true);
  };

  return (
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{height: '100%'}}>
      <View style={{padding: 20, flex: 1, marginBottom: 110}}>
        <Text style={styles.text}>add a new garden</Text>
        {/* add garden section */}
        <View>
          <Text style={styles.t4}>Give a name to your garden</Text>
          <TextInput
            value={gardenName}
            onChangeText={text => setGardenName(text)}
            placeholderTextColor={'#21212160'}
            placeholder="Garden Name"
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
          <Text style={styles.t4}>Select garden type</Text>
          <View
            style={{
              width: '100%',
              height: isHidden ? 42 : 150,
              borderWidth: 0,
              borderRadius: 5,
              marginBottom: isHidden ? 0 : 30,
            }}>
            <AutocompleteInput
              data={findGardenTypes(selectedGardenType)}
              defaultValue={selectedGardenType}
              onChangeText={text => {
                setSelectedGardenType(text);
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
              placeholder="Enter garden type"
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
          <View
            style={{
              padding: 10,
              width: '100%',
            }}>
            <Text style={styles.t4}>Add location of your garden</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  ...styles.button_left,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  navigation.navigate('DrawPolygon', {onUpdate: onUpdate});
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
              {polygon.length > 2 && (
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
        </View>
        <TouchableOpacity
            style={{...styles.button_right, width: 125}}
            onPress={addGarden}>
            <Text style={{...styles.bt1}}>Save</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default CreateGarden;
