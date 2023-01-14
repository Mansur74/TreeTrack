import {View, Text, TouchableOpacity, TextInput, Image, ScrollView, ToastAndroid} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import React, {useState, useEffect} from 'react';
import PhotoPick from '../layouts/ImagePicker';
import {useRoute} from '@react-navigation/native';

// fake data - TODO: retrieve from API
const gardenTypeList = [
  {id: 1, name: 'Farm'},
  {id: 2, name: 'Container Garden'},
  {id: 3, name: 'Ferennial garden'},
  {id: 4, name: 'Rose garden'},
  {id: 5, name: 'Water garden'},
];
const Stack = createNativeStackNavigator()
const CreateGarden = ({navigation}) => {
  const route = useRoute(); // polygon coordinates will come from GardenArea page
  const polygon = route.params ? route.params.coordinates : [];
  const [pickerValue, setPickerValue] = useState(gardenTypeList[0].name);
  const [imagePath, setSelectedImage] = useState(null);
  const [gardenName, setGardenName] = useState(null);
  const [gardenNote, setGardenNote] = useState(null);
  const onSelectImage = image => {
    if (!image) {
      setSelectedImage(null);
    } else {
      setSelectedImage(image.path);
    }
  };


  return (
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{height: '100%'}}>
      <View style={{padding: 20, flex: 1, marginBottom: 110}}>
        <Text style={styles.text}>Add a new garden</Text>

        <Text
          style={{
            fontSize: 15,
            color: '#FFF1DD',
          }}>
          Add a photo of your garden
        </Text>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Polygon coordinates={coordinates} />
        </MapView>
      </View>
    </LinearGradient>
  );
};

export default CreateGarden;
