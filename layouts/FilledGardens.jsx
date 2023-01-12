import { View, Text, Image, FlatList, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";
import GardenCard from "./GardenCard";
import { MenuProvider } from "react-native-popup-menu";



const FilledGardens = ({ navigation, gardens }) => {
    return (
        <LinearGradient
            colors={["#FFFFFF", "#FFFFFF"]}
            style={{ height: "100%" }}
        >
            <View style={{ flex: 1 }}>

                <View style={{
                    padding: 20,
                    flex: 1,
                }}>
                    <Text style={{ fontSize: 30, color: "white", fontWeight: "bold", color: "#9E673D" }}>
                        my gardens
                    </Text>

                </View>
                <View style={{
                    flex: 17,
                }}>
                    <LinearGradient
                        colors={["#D1A96DE5", "#DB966FE5"]}
                        style={{
                            height: "100%",
                            padding: 20,
                            borderTopLeftRadius: 50,
                            borderTopRightRadius: 50
                        }}>

                        <ScrollView
                            style={{
                                marginBottom: 100
                            }}>

                            <MenuProvider>
                                {
                                    gardens.map(garden =>
                                        <GardenCard key={garden.name} garden={garden} />
                                    )
                                }
                            </MenuProvider>


                        </ScrollView>

                        <TouchableOpacity
                            style={{ position: "absolute", backgroundColor: "#FFF1DD", padding: 20, borderRadius: 50, end: 20, bottom: 130 }}
                            onPress={() => {
                                navigation.navigate("CreateGarden")
                            }}
                        >

                            <Image
                                source={require("../images/icons/plus.png")}
                                resizeMode="stretch"
                                style={{ height: 25, width: 25 }}
                            >

                            </Image>
                        </TouchableOpacity>



                    </LinearGradient>

                </View>

            </View>

        </LinearGradient>
    )
}

export default FilledGardens