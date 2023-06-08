import { View, Text, Image, RefreshControl, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import { TouchableOpacity } from "react-native";
import PlantCard from "./PlantCard";
import { useState, useCallback } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { getPlantsOfGarden } from "../services/garden_services";

const FilledPlants = ({ navigation, garden, plants, onUpdate }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [plantList, setPlantList] = useState(plants)
	const onRefresh = useCallback(async() => {
		setRefreshing(true);
		const data = await getPlantsOfGarden(garden.id, true);
		setRefreshing(false);
		setPlantList(data);
	}, []);
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
							}}
							refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

							<MenuProvider>
			
								{
									plantList.map(plant =>
										<PlantCard navigation={navigation} key={plant.name} plant={plant} garden={garden} onUpdate={onUpdate} />
									)
								}
							</MenuProvider>


						</ScrollView>

						<TouchableOpacity
						  onPress={() => {navigation.navigate("CreatePlant", {garden: garden}, {onUpdate: onUpdate})}}
							style={{ position: "absolute", end: 10, bottom: 130 }}

						>

							<Image
								source={require("../images/icons/plus3.png")}
								resizeMode="stretch"
								style={{ height: 65, width: 65 }}
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