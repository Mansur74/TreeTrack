import { View, Text } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const CreateGarden = () => {
    const gradientHeight = 700;
    const gradientBackground = "green"
    return (

        <LinearGradient
            colors={["#D1A96DE5", "#DB966FE5"]}
            style={{ height: "100%" }}
        >
            <View style={styles.container}>
                <Text style={styles.text}>
                    Add a new garden
                </Text>

                <Text style={{
                    fontSize: 15,
                    color: "white",

                    color: "#FFF1DD"
                }}>
                    Add a photo of your garden
                </Text>

                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />

            </View>

        </LinearGradient>

    )
}


export default CreateGarden