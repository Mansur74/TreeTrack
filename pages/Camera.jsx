import { View, Text} from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, { useState } from 'react';
import Pick from "../layouts/Pick";
import UnPick from "../layouts/UnPick";
import {Picker} from '@react-native-picker/picker';

const Camera = () => {
    const [isAuthenticated, setAuthenticated] = useState(true)

    const handleUnPick = () => setAuthenticated(false)
    const handlePick = () => setAuthenticated(true)
    
    const gardens = ['Garden 1', 'My Walnut']; 
    const [selectedValue, setSelectedValue] = useState(gardens[0]);

    return (
      <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
        <View style={styles.container}>
          <Text style={styles.text}>add photo</Text>
          {isAuthenticated ? (
            <UnPick pick={handlePick} />
          ) : (
            <Pick unPick={handleUnPick} />
          )}

          <Text style={styles.t4}>Select a garden</Text>
        
        
          <Picker
            selectedValue={selectedValue}
            style={{height: 30, width: 200, backgroundColor: '#fff'}}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }>
            {gardens.map(garden => (
              <Picker.Item key={garden} label={garden} value={garden} />
            ))}
          </Picker>
        </View>
      </LinearGradient>
    );
}

export default Camera