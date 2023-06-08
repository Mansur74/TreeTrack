import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
  KeyboardAvoidingView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/Style';
import React, {useState, useEffect} from 'react';
import PhotoPick from '../photo_picker/ImagePicker';
import {Picker} from '@react-native-picker/picker';
import storage from '@react-native-firebase/storage';
import {getSortedGardensByDistance, insertGardenNote} from '../../services/garden_services';
import Geolocation from '@react-native-community/geolocation';

const GardenNote = ({navigation}) => {
  const [gardenList, setGardenList] = useState([]);
  // TODO: konum takibi izin verilmemişse varsayılan konumu Ankara yap
  const [currentPosition, setPosition] = useState(null);
  useEffect(() => {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    });
  }, []);
  
  // bahçeler kullanıcının konumuna olan yakınlığına göre sıralanır
  useEffect(() => {
    const fetchData = async () => {
      if(currentPosition){
        setGardenList(await getSortedGardensByDistance(currentPosition));
      }
      // TODO: hiç bahçe yoksa create garden'a yönlendirilmeli
    };
    fetchData();
  }, [currentPosition]);

  {/* TODO: kullanıcıya en yakın olan bahçelere göre bu liste sıralanmalı */}
  let gardenNames = gardenList.map(garden => ({
    id: garden.id,
    gardenName: garden.name,
  }));

  const [selectedGarden, setSelectedGarden] = useState(gardenList[0]);
  const [gardenPickerValue, setGardenPickerValue] = useState(gardenNames[0]);
  const [gardenNote, setTextInputValue] = useState('');

  const [image, setSelectedImage] = useState(null);
  
  const [isImageCleared, setIsImageCleared] = useState(false)
  const onSelectImage = image => {
    if (!image) {
      setSelectedImage(null);
    } else {
      setSelectedImage(image);
      setIsImageCleared(false)
    }
  };

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
    // upload image to storage and get URL
    let imageUrl = null;
    if (image != null && image.path != null) {
      const imageName = image.path.split('/').pop();
      await uploadImage(image.path, 'gardens');
      console.log('Image is saved');
      imageUrl = await getImageUrl('gardens', imageName);
      console.log('URL of saved image: ', imageUrl);
    }
    // construct new garden note
    const newGardenNote = {
      created_at: new Date(),
      garden_id: selectedGarden.id,
      note: gardenNote,
      image_url: imageUrl,
    };
    try {
      await insertGardenNote(newGardenNote);
      ToastAndroid.show(
        'Garden note for ' + selectedGarden.name + ' is saved.',
        ToastAndroid.LONG,
      );
      // clear inputs
      setIsImageCleared(true)
      setTextInputValue('')
      setSelectedGarden(gardenList[0])
      setGardenPickerValue(gardenNames[0])
      navigation.navigate('AddNote');  
    } catch (error) {
      console.log('Insert garden note error: ', error);
    }
    
  };
  
  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
      <ScrollView>
        <View style={{marginBottom: 90}}>
          <Text style={styles.t4}>
            Take a photo of your garden or select it from your gallery.
          </Text>
          <PhotoPick onSelect={onSelectImage} isCleared = {isImageCleared} setIsCleared = {setIsImageCleared}></PhotoPick>

          <Text style={styles.t4}>Select a garden</Text>
          <View style={styles.picker_view}>
            <Picker
              dropdownIconRippleColor={'rgba(202, 255, 222, 0.56)'}
              dropdownIconColor={'#21212110'}
              style={{color: '#212121'}}
              selectedValue={gardenPickerValue}
              onValueChange={itemValue => {
                setGardenPickerValue(itemValue);
                setSelectedGarden(
                  gardenList.find(garden => garden.id === itemValue),
                );
              }}>
              {gardenNames.map(garden => (
                <Picker.Item
                  key={garden.id}
                  label={garden.gardenName}
                  value={garden.id}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.t4}>Enter your notes</Text>
          <KeyboardAvoidingView 
            behavior='padding'
            keyboardVerticalOffset={10}
            >
            <TextInput
              value={gardenNote}
              onChangeText={text => setTextInputValue(text)}
              multiline
              numberOfLines={5}
              placeholder="Garden notes..."
              placeholderTextColor={'#21212160'}
              style={styles.text_area}
            />
            {/* TODO: fotoğraf seçilince küçük ekranlarda bu buton navbar'ın altında kalıyor */}
            <TouchableOpacity style={styles.button_right} onPress={saveNote}>
              <Text style={styles.bt1}> Save </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default GardenNote;
