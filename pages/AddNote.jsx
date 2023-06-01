import { View, Text, TouchableOpacity } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, { useState} from 'react';
//import gardenList from "./jsons/garden_list.json";
import PlantNote from "../layouts/add_note/PlantNote";
import GardenNote from "../layouts/add_note/GardenNote";

const AddPlantNote = ({ navigation }) => {
  const [showGarden, setShowGarden] = useState(false); // display plant note page by default
  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
      <View
        style={{
          padding: 20,
          flex: 1,
          marginBottom: 150,
        }}>
        <Text style={styles.text}>add note</Text>
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
                backgroundColor: !showGarden ? '#25596E' : '#09A555',
                borderRadius: 5,
              }}
              onPress={() => setShowGarden(false)}>
              <Text style={styles.bt1}> Plant </Text>
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
                backgroundColor: showGarden ? '#25596E' : '#09A555',
                borderRadius: 5,
              }}
              onPress={() => setShowGarden(true)}>
              <Text style={styles.bt1}> Garden </Text>
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