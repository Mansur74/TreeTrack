import EmptyGardens from "../layouts/EmptyGardens";
import FilledGardens from "../layouts/FilledGardens";
import { useEffect, useState } from "react";
import {getUserGardens} from "../services/garden_services"; 

const Gardens = ({ navigation }) => {
  const [gardens, setGardens] = useState([])
  const updateGardens = async () => {
    const data = await getUserGardens(true);
    setGardens(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserGardens(true);
      setGardens(data);
    };
    fetchData();
  }, []);

  return (
    gardens.length == 0
      ? <EmptyGardens navigation={navigation} />
      : <FilledGardens navigation={navigation} gardens={gardens} onUpdate={updateGardens}/>
  )
}

export default Gardens