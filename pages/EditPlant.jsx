import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useState } from 'react';
import styles from '../styles/Style';
import { useRoute } from '@react-navigation/native';
import { updatePlant } from '../services/plant_services';

const EditPlant = ({ navigation }) => {
    const route = useRoute();
    const plant = route.params.plant;
    const garden = route.params.garden;
    const onUpdate = route.params.onUpdate;
    const plantNewLocation = route.params && route.params.new_coordinates ? route.params.new_coordinates : {};

    const [plantNote, setTextInputValue] = useState('');
    const [plantName, setPlantNameValue] = useState(plant.name);

    const handleUpdatePlant = async () => {
        const updated_plant = plant
        if(Object.keys(plantNewLocation).length === 2)
            updated_plant.location = plantNewLocation
        if(plantName.length > 0)
            updated_plant.name = plantName
        try {
            await updatePlant(plant.id, updated_plant)
            ToastAndroid.show("Plant is updated.", ToastAndroid.SHORT)
        } catch (error) {
            console.log("Error update plant: ", error)
        }
        
    };
    return (
        <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{ height: '100%' }}>
            <View
                style={{
                    padding: 20,
                    flex: 1,
                    marginBottom: 150,
                }}>
                <ScrollView>
                    <View style={{ marginBottom: 90 }}>
                        <Text style={styles.subtext}> &gt; {plant.name}</Text>
                        <Text style={styles.text}>edit plant</Text>
                        <Text style={styles.t4}>Edit plant name</Text>
                        <TextInput
                            value={plantName}
                            onChangeText={text => setPlantNameValue(text)}
                            placeholder={plant.name}
                            placeholderTextColor={'#21212160'}
                            style={styles.text_area}
                        />
                        <Text style={styles.t4}>Edit location of your plant</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    ...styles.button_left,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    navigation.navigate('EditPlantLocation', { plant, garden, onUpdate });
                                }}>
                                <Image
                                    source={{
                                        uri: 'https://cdn-icons-png.flaticon.com/32/854/854901.png',
                                    }}
                                    style={{
                                        width: 25,
                                        height: 25,
                                    }}></Image>
                                <Text style={{ ...styles.bt1, color: '#212121', marginLeft: 5 }}>
                                    Open Map
                                </Text>
                            </TouchableOpacity>
                            {Object.keys(plantNewLocation).length === 2 && (
                                <Image
                                    source={{
                                        uri: 'https://cdn-icons-png.flaticon.com/32/8968/8968523.png',
                                    }}
                                    style={{
                                        width: 38,
                                        height: 38,
                                    }}/>
                            )}
                        </View>
                        <TouchableOpacity style={styles.button_right} onPress={handleUpdatePlant}>
                            <Text style={styles.bt1}> Update </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

        </LinearGradient>
    );
};

export default EditPlant;
