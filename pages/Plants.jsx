import EmptyPlants from "../layouts/EmptyPlants";
import FilledPlants from "../layouts/FilledPlants";
import { useEffect, useState } from "react";
import { getPlantsOfGarden, getUserGardens } from "../services/garden_services";

const Plants = ({ navigation, route }) => {

	const garden = route.params.garden;
	const [plants, setPlants] = useState([])
	const updatePlants = async () => {
		const data = await getPlantsOfGarden(garden.id)
		setPlants(data);
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await getPlantsOfGarden(garden.id)
			setPlants(data);
		};
		fetchData();
	}, []);

	return (
		plants.length == 0
			? <EmptyPlants navigation={navigation} garden={garden} />
			: <FilledPlants navigation={navigation} garden={garden} plants={plants} onUpdate={updatePlants} />
	)
}

export default Plants