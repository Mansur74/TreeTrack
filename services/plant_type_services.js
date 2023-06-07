import firestore from '@react-native-firebase/firestore';
import { getFromStorage } from './storage';


export const getPlantTypes = async () =>{
  const user_uid = await getFromStorage('userId');
  const plantTypesRef = firestore().collection('plant_types');
  const query = plantTypesRef.where('user_id', 'in', [user_uid, "1"]);
  const plantTypes = await query.get();
  const plantTypeList = [] 
  plantTypes.docs.map(async doc => {
    const plant_type = doc.data().plant_type;
    plantTypeList.push(plant_type)
  })
  plantTypeList.sort((a, b) => a.localeCompare(b))
  return plantTypeList;
}

export const insertNewPlantType = async (plant_type) => {
  const user_uid = await getFromStorage('userId');
  const newPlantType = {
    plant_type: plant_type,
    user_id: user_uid
  }
  await firestore().collection('plant_types').add(newPlantType);
};

export const searchPlantType = async (plant_type, plant_types) =>{
  // search plant type
  const lowerCasePlantTypes = plant_types.map(pt => pt.toLowerCase().trim())
  const plantTypeIdx = lowerCasePlantTypes.indexOf(plant_type.toLowerCase().trim())
  // insert new plant type for this user if it's not found in the list
  if(plantTypeIdx === -1){ 
    try {
      // plant type should start with uppercase
      const formatedPlantType = plant_type.charAt(0).toUpperCase() + plant_type.slice(1).toLowerCase();
      await insertNewPlantType(formatedPlantType.trim())
      plant_types.push(formatedPlantType)
      return {plant_type: formatedPlantType, plantTypes: plant_types}
    } catch (error) {
      console.log("add new plant type error: ", error)
    }
  }
  else{
    return {plant_type: plant_types[plantTypeIdx], plantTypes: plant_types}
  }
}
