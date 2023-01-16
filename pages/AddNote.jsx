import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, { useState, useEffect} from 'react';
import PhotoPick from "../layouts/ImagePicker";
import { Picker } from '@react-native-picker/picker';
//import gardenList from "./jsons/garden_list.json";
import firestore from "@react-native-firebase/firestore"
import PlantNote from "../layouts/add_note/PlantNote";
import GardenNote from "../layouts/add_note/GardenNote";


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
  const [showGarden, setShowGarden] = useState(true); // display gardens by default
  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
      <View
        style={{
          padding: 20,
          flex: 1,
          marginBottom: 150,
        }}>
        <Text style={styles.text}>add plant note</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: '#09A555',
            }}>
            <TouchableOpacity
              style={{
                width: 100,
                padding: 5,
                backgroundColor: showGarden ? '#25596E' : '#09A555',
                borderRadius: 5,
              }}
              onPress={() => setShowGarden(true)}>
              <Text style={styles.bt1}> Garden </Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: '#FFFFFF50',
                width: 2,
                height: 25,
                marginStart: 5,
                marginEnd: 5,
              }}></View>

            <TouchableOpacity
              style={{
                width: 100,
                padding: 5,
                backgroundColor: !showGarden ? '#25596E' : '#09A555',
                borderRadius: 5,
              }}
              onPress={() => setShowGarden(false)}>
              <Text style={styles.bt1}> Plant </Text>
            </TouchableOpacity>
          </View>
        </View>

        {!showGarden && <PlantNote navigation={navigation}></PlantNote>}
        {showGarden && <GardenNote navigation={navigation}></GardenNote>}
      </View>
    </LinearGradient>
  );
}

export default AddPlantNote