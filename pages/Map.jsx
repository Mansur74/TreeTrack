import { View } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";

const Map = () => {
	return (

		<LinearGradient
			colors={["#D1A96DE5", "#DB966FE5"]}
			style={{ height: "100%" }}
		>
			<View style={styles.container}>
			</View>

		</LinearGradient>

	)
}


export default Map