import { View, Text, Image, FlatList, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";
import PlantCard from "./PlantCard";
import { MenuProvider } from "react-native-popup-menu";

const FilledPlants = ({ navigation, garden, plants, onUpdate }) => {

	const gardenName = garden.name;
	return (
		<LinearGradient
			colors={["#FFFFFF", "#FFFFFF"]}
			style={{ height: "100%" }}
		>
			<View style={{ flex: 1 }}>

				<View style={{
					padding: 20,
					flex: 1.2,
				}}>
					<Text style={{ fontSize: 20, fontWeight: "bold", color: "#3A7C5A" }}> {'\u003E'}{gardenName} </Text>
					<Text style={{ fontSize: 30, fontWeight: "bold", color: "#09A555" }}>
						my plants
					</Text>

				</View>
				<View style={{
					flex: 16.8,
				}}>
					<LinearGradient
						colors={["#89C6A7", "#89C6A7"]}
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
									plants.map(plant =>
										<PlantCard navigation={navigation} key={plant.name} plant={plant} garden={garden} onUpdate={onUpdate} />
									)
								}
							</MenuProvider>


						</ScrollView>

						<TouchableOpacity
						  onPress={() => {navigation.navigate("CreatePlant", {garden: garden}, {onUpdate: onUpdate})}}
							style={{ position: "absolute", backgroundColor: "#FFF1DD", padding: 20, borderRadius: 50, end: 20, bottom: 130 }}

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

export default FilledPlants