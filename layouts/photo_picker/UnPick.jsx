import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import styles from '../../styles/Style';

const UnPick = ({openCamera, openGallery}) => {
  return (
    <View style={{alignItems: 'center'}}>
      
        <TouchableOpacity
          onPress={openCamera}
          title="Take a Photo"
          style={styles.button}>
          <Text style={styles.bt1}> Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openGallery}
          title="Open Gallery"
          style={styles.button}>
          <Text style={styles.bt1}> Select from Gallery </Text>
        </TouchableOpacity>
   
    </View>
  );
};

export default UnPick;