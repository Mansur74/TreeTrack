import firestore from '@react-native-firebase/firestore';
import { getFromStorage } from './storage';


export const getGardenTypes = async () =>{
  const user_uid = await getFromStorage('userId');
  const gardenTypesRef = firestore().collection('garden_types').where('user_id', 'in', [user_uid, "1"]);
  const gardenTypes = await gardenTypesRef.get();
  const gardenTypeList = [] 
  gardenTypes.docs.map(async doc => {
    const garden_type = doc.data().garden_type;
    gardenTypeList.push(garden_type)
  })
  gardenTypeList.sort((a, b) => a.localeCompare(b))
  return gardenTypeList;
}

export const insertNewGardenType = async (garden_type) => {
  const user_uid = await getFromStorage('userId');
  const newGardenType = {
    garden_type: garden_type,
    user_id: user_uid
  }
  await firestore().collection('garden_types').add(newGardenType);
};

export const searchGardenType = async (garden_type, garden_type_list) =>{
  // search garden type
  const lowerCaseGardenTypes = garden_type_list.map(gt => gt.toLowerCase().trim())
  const gardenTypeIdx = lowerCaseGardenTypes.indexOf(garden_type.toLowerCase().trim())
  // insert new garden type for this user if it's not found in the list
  if(gardenTypeIdx === -1){ 
    try {
      // garden type should start with uppercase
      const formatedGardenType = garden_type.charAt(0).toUpperCase() + garden_type.slice(1).toLowerCase();
      await insertNewGardenType(formatedGardenType.trim())
      garden_type_list.push(formatedGardenType)
      return {garden_type: formatedGardenType, gardenTypes: garden_type_list}
    } catch (error) {
      console.log("add new garden type error: ", error)
    }
  }
  else{
    return {garden_type: garden_type_list[gardenTypeIdx], gardenTypes: garden_type_list}
  }
}
