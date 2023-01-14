import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, { useState} from 'react';
import PhotoPick from "../layouts/ImagePicker";
import { Picker } from '@react-native-picker/picker';
import gardenList from "./jsons/garden_list.json";

const AddPlantNote = ({ navigation }) => {
  // fake data loaded from json file - TODO: get from API
  let gardenNames = gardenList.map(garden => ({
    id: garden.id,
    gardenName: garden.gardenName,
  }));

  const [selectedGarden, setSelectedGarden] = useState(gardenList[0]);
  const [pickerValue, setPickerValue] = useState(gardenNames[0]);
  const [plantNote, setTextInputValue] = useState('');

  const [imagePath, setSelectedImage] = useState(null);
  const onSelectImage = image => {
    if (!image) {
      setSelectedImage(null);
    } else {
      setSelectedImage(image.path);
    }
  };

  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
      <ScrollView>
        <View
          style={{
            padding: 20,
            flex: 1,
            marginBottom: 150,
          }}>
          <Text style={styles.text}>add plant note</Text>
          <Text style={styles.t4}>
            Take a photo of your plant or select it from your gallery.
          </Text>
          <PhotoPick onSelect={onSelectImage}></PhotoPick>

          <Text style={styles.t4}>Select a garden</Text>
          <View
            style={styles.picker_view}>
            <Picker
              dropdownIconRippleColor={'rgba(202, 255, 222, 0.56)'}
              dropdownIconColor={'#21212110'}
              style={{color: '#212121'}}
              selectedValue={pickerValue}
              onValueChange={itemValue => {
                setPickerValue(itemValue);
                setSelectedGarden(
                  gardenList.find(garden => garden.id === itemValue),
                );
              }}>
              {gardenNames.map(garden => (
                <Picker.Item
                  key={garden.id}
                  label={garden.gardenName}
                  value={garden.id}
                  color="#fff"
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.t4}>Enter your notes</Text>
          <TextInput
            value={plantNote}
            onChangeText={text => setTextInputValue(text)}
            multiline
            numberOfLines={5}
            placeholder="Plant notes..."
            placeholderTextColor={'#21212160'}
            style={styles.text_area}
          />
          {/* TODO: fotoğraf seçilince küçük ekranlarda bu buton navbar'ın altında kalıyor */}
          <TouchableOpacity
            style={styles.button_right}
            onPress={() => {
              navigation.navigate('SelectPlant', {
                selectedGarden,
                plantNote,
                imagePath,
              });
            }}>
            <Text style={styles.bt1}> Select Plant </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default AddPlantNote