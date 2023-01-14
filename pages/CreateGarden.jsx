import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ToastAndroid,
} from 'react-native';
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

  // TODO: API post request
  const saveGarden = () => {
    const gardenObj = {
      gardenName,
      gardenType: pickerValue,
      gardenImage: imagePath,
      gardenNote,
      userIds: [1],
      polygon,
    };
    console.log('Saved garden: ', gardenObj);
    ToastAndroid.show('Garden is saved.', ToastAndroid.SHORT);
    navigation.navigate('Gardens');
  };

  return (
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{height: '100%'}}>
      <View style={{padding: 20, flex: 1, marginBottom: 110}}>
        <Text style={styles.text}>add a new garden</Text>

        <ScrollView>
          <View
            style={{
              padding: 10,
              width: '100%',
            }}>
            <Text style={styles.t4}>Add a photo of your garden</Text>
            <PhotoPick onSelect={onSelectImage}></PhotoPick>
            <Text style={styles.t4}>Give a name to your garden</Text>
            <TextInput
              value={gardenName}
              onChangeText={text => setGardenName(text)}
              placeholderTextColor={'#21212160'}
              placeholder="Garden Name"
              style={{
                width: '100%',
                height: 42,
                paddingStart: 10,
                paddingEnd: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                borderWidth: 0,
                color: '#212121',
                textAlignVertical: 'top',
                elevation: 5,
                fontSize: 16,
              }}></TextInput>
            <Text style={styles.t4}>Select garden type</Text>
            <View style={styles.picker_view}>
              <Picker
                dropdownIconRippleColor={'rgba(255, 209, 188, 0.56)'}
                dropdownIconColor={'#21212110'}
                style={{color: '#212121'}}
                selectedValue={pickerValue}
                onValueChange={itemValue => {
                  setPickerValue(itemValue);
                }}>
                {gardenTypeList.map(gardenType => (
                  <Picker.Item
                    key={gardenType.id}
                    label={gardenType.name}
                    value={gardenType.id}
                    color="#fff"
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.t4}>Add location of your garden</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  ...styles.button_left,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  navigation.navigate('DrawPolygon');
                }}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/32/854/854901.png',
                  }}
                  style={{
                    width: 25,
                    height: 25,
                  }}></Image>
                <Text style={{...styles.bt1, color: '#212121', marginLeft: 5}}>
                  Open Map
                </Text>
              </TouchableOpacity>
              {polygon.length > 2 && (
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/32/8968/8968523.png',
                  }}
                  style={{
                    width: 38,
                    height: 38,
                  }}></Image>
              )}
            </View>

            <Text style={styles.t4}>Enter your notes</Text>
            <TextInput
              value={gardenNote}
              onChangeText={text => setGardenNote(text)}
              placeholderTextColor={'#21212160'}
              multiline
              numberOfLines={3}
              placeholder="Garden notes..."
              style={styles.text_area}
            />

            <TouchableOpacity
              style={{...styles.button_right, width: 125}}
              onPress={saveGarden}>
              <Text style={{...styles.bt1}}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default CreateGarden;
