import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import React, { useState } from 'react';
import PhotoPick from '../layouts/ImagePicker';
import storage from "@react-native-firebase/storage"
import { insertNewPlant } from '../services/plant_services';

// fake data - TODO: retrieve from API
const gardenTypeList = [
  { id: 1, name: 'Walnut' }
];
const CreatePlant = ({ route, navigation }) => {
  const onUpdate = route.params && route.params.onUpdate ? route.params.onUpdate : () => { };
  const plantLocation = route.params && route.params.coordinates ? route.params.coordinates : [];
  const garden = route.params.garden
  const [plantTypePickerValue, setPickerValue] = useState(gardenTypeList[0].name);
  const [imagePath, setSelectedImage] = useState(null);
  const [plantName, setPlantName] = useState(null);
  const [plantNote, setPlantNote] = useState(null);

  const onSelectImage = image => {
    if (!image) {
      setSelectedImage(null);
    } else {
      setSelectedImage(image.path);
    }
  };

  // add plant
  const addPlant = async () => {
    let imageUrl = null
    if (imagePath != null) {
      const imageName = imagePath.split('/').pop();
      await uploadImage(imagePath, 'plants');
      console.log('Image is saved');
      imageUrl = await getImageUrl('plants', imageName);
      console.log('URL of saved image: ', imageUrl);
    }
    const plantData = {
      name: plantName,
      plant_type: plantTypePickerValue,
      created_at: new Date(),
      garden_id: garden.id,
      location: plantLocation,
      image_url: imageUrl
    };
    // TODO: bitki notunu da kaydet? 
    try {
      await insertNewPlant(plantData);
      ToastAndroid.show('Plant is added.', ToastAndroid.SHORT);
      onUpdate();
      navigation.navigate('Gardens');
    } catch (error) {
      console.log("Insert plant error: ", error)
    }

  };

  const uploadImage = async (imageUri, folderName) => {
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

  return (
    <LinearGradient
      colors={['#89C6A7', '#89C6A7']}
      style={{ height: '100%' }}>
      <View style={{ padding: 20, flex: 1, marginBottom: 110 }}>
      <Text style={{ fontSize: 20, color: "white", fontWeight: "bold", color: "#fff" }}> {'\u003E'}{garden.name} </Text>
        <Text style={styles.text}>add a new plant</Text>

        <ScrollView>
          <View
            style={{
              padding: 10,
              width: '100%',
            }}>
            <Text style={styles.t4}>Add a photo of your plant</Text>
            <PhotoPick onSelect={onSelectImage}></PhotoPick>
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
            <View style={styles.picker_view}>
              <Picker
                dropdownIconRippleColor={'rgba(255, 209, 188, 0.56)'}
                dropdownIconColor={'#21212110'}
                style={{ color: '#212121' }}
                selectedValue={plantTypePickerValue}
                onValueChange={itemValue => {
                  setPickerValue(itemValue);
                }}>
                {gardenTypeList.map(gardenType => (
                  <Picker.Item
                    key={gardenType.id}
                    label={gardenType.name}
                    value={gardenType.name}

                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.t4}>Add location of your plant</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  ...styles.button_left,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  navigation.navigate('AddPlantLocation', { garden, plantName, onUpdate });
                }}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/32/854/854901.png',
                  }}
                  style={{
                    width: 25,
                    height: 25,
                  }}></Image>
                <Text style={{ ...styles.bt1, color: '#212121', marginLeft: 5 }}>
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

            <Text style={styles.t4}>Enter descriptions of your plant</Text>
            <TextInput
              value={plantNote}
              onChangeText={text => setPlantNote(text)}
              placeholderTextColor={'#21212160'}
              multiline
              numberOfLines={3}
              placeholder="Plant notes..."
              style={styles.text_area}
            />

            <TouchableOpacity
              style={{ ...styles.button_right, width: 125 }}
              onPress={addPlant}>
              <Text style={{ ...styles.bt1 }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default CreatePlant;
