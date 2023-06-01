import { View, Text, TouchableOpacity } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import GardenGallery from '../layouts/gallery/GardenGallery';
import PlantGallery from '../layouts/gallery/PlantGallery';
import React, { useState, useEffect} from 'react';

const Galleries = ({route}) => {
  // TODO: view in gallery
  const garden = route.params && route.params.garden ? route.params.garden : null;
  const plant = route.params && route.params.plant ? route.params.plant : null;
  const isGardenShown = route.params && route.params.showGarden !== null ? route.params.showGarden : false;
  
  const [showGarden, setShowGarden] = useState(true) // display gardens by default

  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={{height: '100%'}}>
      <View style={{flex: 1}}>
        <View
          style={{
            padding: 20,
            flex: 3,
          }}>
          <Text
            style={{
              fontSize: 30,
              color: 'white',
              fontWeight: 'bold',
              color: '#09A555',
              marginBottom: 10,
            }}>
            gallery
          </Text>

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
                  backgroundColor: showGarden ? '#25596E': '#09A555',
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
                  backgroundColor: !showGarden ? '#25596E': '#09A555',
                  borderRadius: 5,
                }}
                onPress={() => setShowGarden(false)}>
                <Text style={styles.bt1}> Plant </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: 20,
            flex: 20,
            backgroundColor: '#89C6A7',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}>
          {showGarden && <GardenGallery selectedGarden = {garden}></GardenGallery>}
          {!showGarden && <PlantGallery></PlantGallery>}
        </View>
      </View>
    </LinearGradient>
  );
}

export default Galleries