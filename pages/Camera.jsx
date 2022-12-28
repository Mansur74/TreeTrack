import { View, Text, TouchableOpacity, TextInput, ScrollView} from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, { useState } from 'react';
import Pick from "../layouts/Pick";
import UnPick from "../layouts/UnPick";
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';

const Camera = ({navigation}) => {

    const handleUnPick = () => setImageSelected(false)
    
    const gardens = ['Garden 1', 'My Walnut']; 
    const [selectedValue, setSelectedValue] = useState(gardens[0]);

    const [image, setImage] = useState(null);
    const [isImageSelected, setImageSelected] = useState(false);

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
      setImageSelected(true);
      //this.bs.current.snapTo(1);
    });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
      setImageSelected(true);
    });
  };


    return (
      <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.text}>add photo</Text>
            {isImageSelected ? (
              <Pick unPick={handleUnPick} image={image} />
            ) : (
              <UnPick openCamera={openCamera} openGallery={openGallery} />
            )}

            <Text style={styles.t4}>Select a garden</Text>

            <Picker
              selectedValue={selectedValue}
              style={{
                height: 30,
                width: 200,
                backgroundColor: '#fff',
                color: 'black',
              }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }>
              {gardens.map(garden => (
                <Picker.Item key={garden} label={garden} value={garden} />
              ))}
            </Picker>
            <Text style={styles.t4}>Enter your notes</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Plant notes"
              style={{
                height: 100,
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 6,
                borderWidth: 0,
                color: 'black',
              }}
            />
            {/* TODO: fotoğraf seçilince küçük ekranlarda bu buton navbar'ın altında kalıyor */}
            <TouchableOpacity
              style={styles.button_right}
              onPress={() => {
                navigation.navigate('SelectPlant');
              }}>
              <Text style={styles.bt1}> Select Plant </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
}

export default Camera