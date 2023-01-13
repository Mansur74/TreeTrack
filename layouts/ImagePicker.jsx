import {
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Pick from './Pick';
import UnPick from './UnPick';
import ImagePicker from 'react-native-image-crop-picker';


const PhotoPick = ({onSelect}) => {

  const handleUnPick = () => setImageSelected(false);

  const [imagePath, setImage] = useState(null);
  const [isImageSelected, setImageSelected] = useState(false);

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        // console.log("Image (camera): ", image);
        setImage(image.path);
        setImageSelected(true);
        onSelect(image);
        //this.bs.current.snapTo(1);
      })
      .catch(error => {
        onSelect(null);
        if (error.message === 'User cancelled image selection') {
          console.log(error.message + ' (camera)');
        } else {
          console.log('Other Error', error);
        }
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        //console.log('Image (gallery): ', image);
        setImage(image.path);
        setImageSelected(true);
        onSelect(image);
      })
      .catch(error => {
        onSelect(null);
        if (error.message === 'User cancelled image selection') {
            console.log(error.message + ' (gallery)');
        } else {
          console.log('Other Error', error);
        }
      });
  };

  return (
    <View>
      {isImageSelected ? (
        <Pick unPick={handleUnPick} image={imagePath} />
      ) : (
        <UnPick openCamera={openCamera} openGallery={openGallery} />
      )}
    </View>
  );
};

export default PhotoPick;
