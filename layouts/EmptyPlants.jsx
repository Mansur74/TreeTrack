import { View, Text, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";

const EmptyPlants = ({ navigation, garden }) => {

	const gardenName = garden.name;

	return (
		<LinearGradient
			colors={['#89C6A7', '#89C6A7']}
			style={{ height: "100%" }}

		>
			<View style={styles.container}>
				<Text style={{ fontSize: 20, color: "white", fontWeight: "bold", color: "#FFF1DD" }}> {'\u003E'}{gardenName} </Text>
				<Text style={{ fontSize: 30, color: "white", fontWeight: "bold", color: "#FFF1DD" }}>
					my plants
				</Text>

				<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
					<TouchableOpacity
					  onPress={() => {navigation.navigate("CreatePlant", {garden: garden})}}
						style={{ backgroundColor: "#25596E", padding: 35, borderRadius: 50 }}
					>

						<Image
							source={require("../images/icons/plus2.png")}
							resizeMode="stretch"
							style={{ height: 30, width: 30 }}
						>

						</Image>
					</TouchableOpacity>
					<Text style={{ color: "#FFF1DD", fontSize: 20, fontWeight: "300", marginTop: 10 }}>create plant for garden</Text>
				</View>
			</View>

		</LinearGradient>

	)

}

export default EmptyPlants;
