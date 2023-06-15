import { Dimensions, Image, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu"
import { deletePlant } from "../services/plant_services";

const {height} = Dimensions.get("window")
// delete garden -> bu islemin digerleri gibi child componentlarda olması lazım
const handleDelete = async (plantId, onUpdate) => {
	try {
		await deletePlant(plantId);
		ToastAndroid.show('Plant is deleted.', ToastAndroid.SHORT);
		onUpdate();
	} catch (error) {
		console.log("Delete plant error: ", error)
	}
}

const PlantCard = ({ navigation, plant, garden, onUpdate }) => {
	const plant_image =
		!plant.image_url
			? 'https://cdn-icons-png.flaticon.com/512/1892/1892747.png'
			: plant.image_url;
	return (
		<TouchableOpacity onPress={()=>{navigation.navigate("ViewPlant", {plant, garden, onUpdate})}}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginBottom: 10,
				}}>
				<View
					style={{
						width: '75%',
						backgroundColor: '#ffffff70',
						padding: 10,
						borderRadius: 10,
					}}>
					<Image
						style={{
							width: '100%',
							height: height*0.25,
							marginBottom: 10,
						}}
						source={{
							uri: plant_image,
						}}></Image>

					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}>

						<Text style={{ color: "#212121" }}>
							{plant.name}
						</Text>


						<Menu>
							<MenuTrigger style={{}}>
								<Image
									style={{ width: 22, height: 22 }}
									source={require('../images/icons/ic_options.png')}>

								</Image>
							</MenuTrigger>
							<MenuOptions
								optionsContainerStyle={{
									width: "100%",
									backgroundColor: '#FFF1DD',
									borderRadius: 5,
								}}>
								<View style={{ borderColor: '#888888', borderWidth: 1 }}>
									<MenuOption onSelect={() => navigation.navigate("EditPlant", {plant, garden, onUpdate})}>
										<Text style={{ textAlign: 'center', color: '#212121' }}>
											Edit
										</Text>
									</MenuOption>
									<View
										style={{ backgroundColor: '#888888', height: 1, width: '100%' }}
									/>
									{/* <MenuOption onSelect={() => alert(`Rename`)}>
										<Text style={{ textAlign: 'center', color: '#212121' }}>
											Rename
										</Text>
									</MenuOption> */}
									<View
										style={{ backgroundColor: '#888888', height: 1, width: '100%' }}
									/>
									<MenuOption onSelect={() => alert(`Share`)}>
										<Text style={{ textAlign: 'center', color: '#212121' }}>
											Share
										</Text>
									</MenuOption>
									<View
										style={{ backgroundColor: '#888888', height: 1, width: '100%' }}
									/>
									<MenuOption onSelect={() => handleDelete(plant.id, onUpdate)}>
										<Text style={{ textAlign: 'center', color: 'red' }}>
											Delete
										</Text>
									</MenuOption>
								</View>
							</MenuOptions>
						</Menu>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default PlantCard