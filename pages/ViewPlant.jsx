import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import React, { useEffect, useState } from 'react';
import styles from "../styles/Style";
import { getPlantNotesById } from "../services/plant_services";
import { formatDate } from "../services/helper";

const ViewGarden = ({ navigation, route }) => {
    const plant = route.params.plant;
    const garden = route.params.garden;
    const onUpdate = route.params.onUpdate;
    const [plantNotes, setPlantNotes] = useState([]);
    if(plant.plant_type.plant_type){
        let pt = plant.plant_type.plant_type
        plant.plant_type = pt
    }
    useEffect(() => {
        const fetchData = async () => {
            const notes = await getPlantNotesById(plant.id)
            setPlantNotes(notes)
        };
        fetchData();

    }, []);



    const plant_image =
        !plant.image_url
            ? 'https://cdn-icons-png.flaticon.com/512/3039/3039008.png'
            : plant.image_url;
    return (
        <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{ height: '100%' }}>
            <View
                style={{
                    padding: 20,
                    flex: 1,
                    marginBottom: 150,
                }}>

                <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                    <Text style={styles.text}>{plant.name}</Text>
                    <TouchableOpacity style={{alignSelf: "center" }} onPress={()=>{
                        navigation.navigate("EditPlant", {plant, garden, onUpdate})}}>
                        <Image
                            style={{ width: 25, height: 25}}
                            source={require("../images/icons/edit.png")} />
                    </TouchableOpacity>
                </View>

                <Text style={{fontSize: 16, marginBottom: 15, color: "#efefef"}}>
                    <Text style={{fontWeight:"bold"}}>Plant Type: </Text> 
                    {!plant.plant_type || plant.plant_type === "" ? "Undefined" : plant.plant_type}
                </Text>
                <Image
                    style={{ width: "100%", height: 250, marginBottom: 20, borderRadius: 10 }}
                    source={{ uri: plant_image }}>

                </Image>
                <Text style={{color: "white", fontSize: 16, textAlign: "center", fontWeight: "bold", marginBottom: 15}}>
                    Plant Notes
                </Text>
                {plantNotes.length == 0 &&
                <Text style={{color: "#efefef", fontSize: 16, textAlign: "center"}}>This plant does not have any note.</Text>
                }
                <ScrollView>
                    {
                        plantNotes.map(note => (
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
                            navigation.navigate("Galleries", {plant, showGarden: false})
                        }}
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