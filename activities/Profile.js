import { View, Text } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";

const Profile = () => {
    const gradientHeight = 700;
    const gradientBackground = "green"
    return (

        <LinearGradient
            colors={["#FFFFFF", "#FFFFFF"]}
            style={{ height: "100%" }}
        >
            <View style={{flex: 1}}>

                <View style={{
                    padding: 20,
                    flex: 1, }}>
                        <Text style={{ fontSize: 30, color: "white", fontWeight: "bold", color: "#09A555"}}>
                            profile
                        </Text>
                
                </View>
                <View style={{
                    padding: 20,
                    flex: 17,
                    backgroundColor: "#89C6A7",
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50
                    }}>
                
                </View>

            </View>

        </LinearGradient>

    )
}

export default Profile