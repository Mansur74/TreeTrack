import { View, Text, TouchableOpacity, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import React, { useEffect, useState } from 'react';
import styles from "../styles/Style";
import { getGardenNotes } from "../services/garden_services";


const ViewGarden = ({ navigation, route }) => {
    const garden = route.params.garden;
    const [gardenNotes, setGardenNotes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const notes = await getGardenNotes()
            setGardenNotes(notes)

        };
        fetchData();

    }, []);



    const garden_image =
        !garden.image_url
            ? 'https://cdn-icons-png.flaticon.com/512/3039/3039008.png'
            : garden.image_url;
    return (
        <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{ height: '100%' }}>
            <View
                style={{
                    padding: 20,
                    flex: 1,
                    marginBottom: 150,
                }}>

                <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", paddingBottom: 10}}>
                    <Text style={styles.text}>{garden.name}</Text>
                    <Image
                    style={{ width: 25, height: 25, alignSelf: "center"}}
                    source={require("../images/icons/edit.png")}>

                </Image>

                </View>

                <Image
                    style={{ width: "100%", height: 250, marginBottom: 20, borderRadius: 10 }}
                    source={{ uri: garden_image }}>

                </Image>
                <Text style={{color: "white"}}>
                    Garden Notes:
                </Text>
                <View>
                    {
                        gardenNotes.map(note => <Text style={{color: "white"}}>{note.note}</Text>)
                    }
                </View>

                <View
                    style={{ flexDirection: "row", justifyContent: "center"}}
                >
                    <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Plants", {garden: garden})
                    }}
                         style={{...styles.button_right, marginRight: 10}}
                       >
                        <Text style={styles.bt1}> Display Plants </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={{...styles.button_right, marginLeftt: 10}}
                        >
                        <Text style={styles.bt1}> View in Gallery </Text>
                    </TouchableOpacity>

                </View>






            </View>
        </LinearGradient>
    );
}

export default ViewGarden