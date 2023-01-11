import { View, Text, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";

const EmptyGardens = ({ navigation }) =>{

    return(
        <LinearGradient
            colors={["#D1A96DE5", "#DB966FE5"]}
            style={{ height: "100%" }}
            
        >
            <View style={styles.container}>
                <Text style={{ fontSize: 30, color: "white", fontWeight: "bold", color: "#FFF1DD"}}>
                    my gardens
                </Text>

                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity 
                        style={{ backgroundColor: "#FFF1DD", padding: 35, borderRadius: 50 }}
                        onPress={() =>{
                            navigation.navigate("CreateGarden")
                        }}>
                    
                        <Image
                            source={require("../images/icons/plus.png")}
                            resizeMode="stretch"
                            style={{ height: 30, width: 30 }}
                        >

                        </Image>
                    </TouchableOpacity>
                    <Text style={{color: "#FFF1DD", fontSize: 20, fontWeight: "300", marginTop: 10}}>create garden</Text>
                </View>
            </View>

        </LinearGradient>

    )

}

export default EmptyGardens;
