import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/Style';
import React, {useState, useEffect} from 'react';
import PhotoPick from '../ImagePicker';
import {Picker} from '@react-native-picker/picker';
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


const PlantNote = ({navigation}) => {
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
  const [plantNote, setTextInputValue] = useState('');

  const [imagePath, setSelectedImage] = useState(null);
  const onSelectImage = image => {
    if (!image) {
      setSelectedImage(null);
    } else {
      setSelectedImage(image);
    }
  };

  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
      <ScrollView>
          <Text style={styles.t4}>
            Take a photo of your plant or select it from your gallery.
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
            value={plantNote}
            onChangeText={text => setTextInputValue(text)}
            multiline
            numberOfLines={5}
            placeholder="Plant notes..."
            placeholderTextColor={'#21212160'}
            style={styles.text_area}
          />
          {/* TODO: foto??raf se??ilince k??????k ekranlarda bu buton navbar'??n alt??nda kal??yor */}
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
        
      </ScrollView>
    </LinearGradient>
  );
};

export default PlantNote;
