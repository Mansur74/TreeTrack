import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import styles from '../styles/Style';
import ImagePicker from 'react-native-image-crop-picker';


const UnPick = ({pick}) => {
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
    <View style={{alignItems: 'center'}}>
      <Text style={styles.t4}>
        Take a photo of your plant or select it from your gallery.
      </Text>
      <View>
        {isImageSelected && (
          <ImageBackground
            source={{
              uri: image,
            }}
            style={{height: 200, width: 200}}
            imageStyle={{borderRadius: 15}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>
          </ImageBackground>
        )}

        <TouchableOpacity
          onPress={openCamera}
          title="Open Camera"
          style={styles.button}>
          <Text style={styles.bt1}> Open Camera </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openGallery}
          title="Open Gallery"
          style={styles.button}>
          <Text style={styles.bt1}> Select from Gallery </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UnPick;