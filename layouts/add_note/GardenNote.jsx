import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/Style';
import React, {useState, useEffect} from 'react';
import PhotoPick from '../ImagePicker';
import {Picker} from '@react-native-picker/picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const getGardensFb = async () => {
  const querySnapshot = await firestore().collection('gardens').get();
  const gList = querySnapshot.docs.map(doc => {
    const data = doc.data();
    data.created_at = String(data.created_at.toDate());
    data.polygon = data.polygon.flat();
    return data;
  });
  return gList;
};

const GardenNote = ({navigation}) => {
  const [gardenList, setGList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setGList(await getGardensFb());
    };
    fetchData();
  }, []);

  let gardenNames = gardenList.map(garden => ({
    id: garden.id,
    gardenName: garden.name,
  }));

  const [selectedGarden, setSelectedGarden] = useState(gardenList[0]);
  const [pickerValue, setPickerValue] = useState(gardenNames[0]);
  const [gardenNote, setTextInputValue] = useState('');

  const [image, setSelectedImage] = useState(null);
  const onSelectImage = image => {
    if (!image) {
      setSelectedImage(null);
    } else {
      setSelectedImage(image);
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
    const newGardenNoteRf = await firestore()
      .collection('garden_notes')
      .add(newGardenNote);
      
    await newGardenNoteRf.update({id: newGardenNoteRf.id});

    ToastAndroid.show(
      'Garden note for ' + selectedGarden.name + ' is saved.',
      ToastAndroid.LONG,
    );
    navigation.navigate('AddNote');
  };
  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
      <ScrollView>
        <Text style={styles.t4}>
          Take a photo of your garden or select it from your gallery.
        </Text>
        <PhotoPick onSelect={onSelectImage}></PhotoPick>

        <Text style={styles.t4}>Select a garden</Text>
        <View style={styles.picker_view}>
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
          value={gardenNote}
          onChangeText={text => setTextInputValue(text)}
          multiline
          numberOfLines={5}
          placeholder="Garden notes..."
          placeholderTextColor={'#21212160'}
          style={styles.text_area}
        />
        {/* TODO: foto??raf se??ilince k??????k ekranlarda bu buton navbar'??n alt??nda kal??yor */}
        <TouchableOpacity style={styles.button_right} onPress={saveNote}>
          <Text style={styles.bt1}> Save </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default GardenNote;
