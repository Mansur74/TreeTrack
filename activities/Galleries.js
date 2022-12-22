import { View } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";

const Galleries = () => {
    const gradientHeight = 700;
    const gradientBackground = "green"
    return (

        <LinearGradient
            colors={["#6DA599", "#9CBC5F"]}
            style={{ height: "100%" }}
        >
            <View style={styles.container}>
            </View>

        </LinearGradient>

    )
}

export default Galleries