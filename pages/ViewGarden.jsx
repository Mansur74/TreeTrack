import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import React, { useEffect, useState } from 'react';
import styles from "../styles/Style";
import { getGardensNoteById } from "../services/garden_services";
import { formatDate } from "../services/helper";

const ViewGarden = ({ navigation, route }) => {
    const garden = route.params.garden;
    const onUpdate = route.params.onUpdate;
    const [gardenNotes, setGardenNotes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const notes = await getGardensNoteById(garden.id)
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

                <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                    <Text style={styles.text}>{garden.name}</Text>
                    <TouchableOpacity style={{alignSelf: "center" }} onPress={()=>{
                        navigation.navigate("EditGarden", {garden, onUpdate})}}>
                        <Image
                            style={{ width: 25, height: 25}}
                            source={require("../images/icons/edit.png")} />
                    </TouchableOpacity>
                </View>

                <Text style={{fontSize: 16, marginBottom: 15, color: "#efefef"}}>
                    <Text style={{fontWeight:"bold"}}>Garden Type: </Text> 
                    {!garden.garden_type || garden.garden_type === "" ? "Undefined" : garden.garden_type}
                </Text>
                <Image
                    style={{ width: "100%", height: 250, marginBottom: 20, borderRadius: 10 }}
                    source={{ uri: garden_image }}>

                </Image>
                <Text style={{color: "white", fontSize: 16, textAlign: "center", fontWeight: "bold", marginBottom: 15}}>
                    Garden Notes
                </Text>
                {gardenNotes.length == 0 &&
                <Text style={{color: "#efefef", fontSize: 16, textAlign: "center"}}>This garden does not have any note.</Text>
                }
                <ScrollView>
                    {
                        gardenNotes.map(note => (
                            <View key={note.id} style={{padding: 10, backgroundColor: "#ffffff20", borderRadius: 5, marginBottom: 5}}> 
                                <Text style={{color: "white"}}>
                                    <Text style={{fontWeight:"bold"}}>[{formatDate(note.created_at)}] </Text>
                                    {note.note}</Text>
                            </View>
                            
                        ))
                    }
                </ScrollView>

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