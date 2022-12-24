import { View, Text, Image, TouchableOpacity, Button } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import React, { useState } from 'react';
import Pick from "../layouts/Pick";
import UnPick from "../layouts/UnPick";

const Camera = () => {
    const [isAuthenticated, setAuthenticated] = useState(true)

    const handleUnPick = () => setAuthenticated(false)
    const handlePick = () => setAuthenticated(true)
    


    return (

        <LinearGradient
            colors={["#89C6A7", "#89C6A7"]}
            style={{ height: "100%" }}
        >
            <View style={styles.container}>

                <Text style={styles.text}>add photo</Text>
                {
                    isAuthenticated?<Pick unPick={handleUnPick} /> : <UnPick pick={handlePick}/>
                }

                <Text style={styles.t4}>
                    Select a garden
                </Text>

            </View>

        </LinearGradient>

    )
}

export default Camera