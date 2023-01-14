import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, { useState, useEffect} from 'react';
import PhotoPick from "../layouts/ImagePicker";
import { Picker } from '@react-native-picker/picker';
//import gardenList from "./jsons/garden_list.json";
import firestore from "@react-native-firebase/firestore"



const getGardensFb = async () => {
  const querySnapshot = await firestore().collection('gardens').get();
  const gList = querySnapshot.docs.map(doc => {
    const data = doc.data();
    data.created_at = String(data.created_at.toDate())
    data.polygon = data.polygon.flat();
    return data;
  });
  return gList
}

/*async function addGarden() {
  const gardenData = {
    name: 'Deneme 2',
    created_at: new Date(),
    polygon: [
      {
        latitude: 40.00633262889164,
        longitude: 32.84801919575038,
      },
      {
        latitude: 40.005992761693285,
        longitude: 32.84736815171272,
      },
      {
        latitude: 40.00561477656015,
        longitude: 32.84741791304044,
      },
      {
        latitude: 40.00568147997102,
        longitude: 32.84838411215366,
      },
      {
        latitude: 40.00633262889164,
        longitude: 32.84801919575038,
      },
    ],
  };
  const newGardenRef = firestore().collection('gardens').doc();
  await newGardenRef.set({
    id: newGardenRef.id,
    polygon: gardenData.polygon.map(
      coordinate => new firestore.GeoPoint(coordinate.latitude, coordinate.longitude),
    ),
    ...gardenData,
  });
  
}*/


const AddPlantNote = ({ navigation }) => {
  const [gardenList, setGList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      
      setGList(await getGardensFb());
    };
    fetchData();
  }, []);

  /*gardenList.forEach(element => {
    console.log(' \n-> garden: ', element);
  }); */
  //addGarden();
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