import firestore from '@react-native-firebase/firestore';
import { getPlantsOfGarden, getUserGardenIds } from './garden_services';
import * as geolib from 'geolib';

export const getPlantNotes = async (withPlantNames = false) => {
  const gardenIds = await getUserGardenIds();
  if(gardenIds.length == 0){
    console.log("Empty garden id list.")
    return []
  }
  const plantIds = [];
  const plants = []
  const plantInfoList = []

  // construct plant batches (firestore limits batches to 10)
  let plantsCollection = await firestore().collection('plants')
  const plantBatches = [];
  while (gardenIds.length) {
    const batch = gardenIds.splice(0, 10);
    plantBatches.push(plantsCollection.where('garden_id', 'in', [...batch]).get().then(results => results.docs.map(result => ({...result.data() }) )))
  }
  // get plant ids
  await Promise.all(plantBatches).then(content => {
    content.flat().forEach(plantData => {
      plants.push(plantData)
      plantIds.push(plantData.id)
      if(withPlantNames)
        plantInfoList.push({id: plantData.id, name: plantData.name, plant_type: plantData.plant_type})
    })
  });

  if(plantIds.length == 0){
    console.log("Empty plant id list.")
    return []
  }

  // construct plant note batches
  let plantNotesCollection = await firestore().collection("plant_notes")
  const plantNoteBatches = []
  while(plantIds.length){
    const batch = plantIds.splice(0, 10)
    plantNoteBatches.push(plantNotesCollection.where("plant_id", "in", [...batch]).orderBy("created_at", "desc").get().then(results => results.docs.map(result => ({...result.data() }) )))
  }

  // get plant notes 
  let notesWithPlantName = [];
  await Promise.all(plantNoteBatches).then(content => {
    content.flat().forEach(plantNoteData => {
      let plant = plants.find(p => p.id === plantNoteData.plant_id);
      if (plant) {
        plantNoteData.plant_name = plant.name;
        notesWithPlantName.push(plantNoteData);
      }
    })
  });

  if(withPlantNames){
    return {notes: notesWithPlantName, plantInfo: plantInfoList}
  }

  return notesWithPlantName;
};

export const getPlantNotesById = async (plantId) => {
  let plantRef = await firestore().collection('plants').doc(plantId).get();
  if(!plantRef.exists){
    return []
  }
  const plantName = plantRef.data().name
  let plantNoteRefs = await firestore()
    .collection('plant_notes')
    .where('plant_id', '==', plantId)
    .orderBy('created_at', 'desc')
    .get();
  const plant_notes = plantNoteRefs.docs.map(doc => {
    const data = doc.data();
    //data.created_at = String(data.created_at.toDate());
    return data;
  });

  let notesWithPlantName = [];
  plant_notes.forEach(note => {
    note.plant_name = plantName;
    notesWithPlantName.push(note);
  });
  return notesWithPlantName;
};

export const insertNewPlant = async newPlant => {
  const ref = firestore().collection('plants').doc();
  await ref.set({
    id: ref.id,
    location: new firestore.GeoPoint(
      newPlant.location.latitude,
      newPlant.location.longitude,
    ),
    ...newPlant,
  });
  return ref.id;
};

export const insertPlantNote = async plantNote => {
  const plantNoteRf = await firestore()
    .collection('plant_notes')
    .add(plantNote);
  await plantNoteRf.update({ id: plantNoteRf.id });
};

export const deletePlant = async plantId => {
  const plantNoteRf = firestore()
    .collection('plant_notes')
    .where('plant_id', '==', plantId);

  const querySnapshot = await plantNoteRf.get();
  querySnapshot.forEach(async doc => {
    console.log("Deleted plant: ", doc)
    await doc.ref.delete();
  });

  const plantRf = firestore()
    .collection('plants')
    .doc(plantId)

  await plantRf.delete();
}

export const getSortedPlantsByDistance = async (userLocation, gardenId) => {
  const plants = await getPlantsOfGarden(gardenId)
  let plantsWithLocation = []
  let plantsWithoutLocation = []
  plants.forEach(plant => {
    if(plant.location){
      const distance = geolib.getDistance(plant.location, userLocation, accuracy= 1);
      plant.distance = distance
      plantsWithLocation.push(plant)
    }
    else{
      plantsWithoutLocation.push(plant)
    }
  });
  const sortedPlants = plantsWithLocation.sort((a, b) => b.distance - a.distance);
  const concatenatedPlantList = sortedPlants.concat(plantsWithoutLocation)
  return concatenatedPlantList
}

export const getClosestPlant = async (userLocation, gardenId) => {
  
  const plants = await getPlantsOfGarden(gardenId)
  let closestPlant = null
  let minDistance = -1
  plants.forEach(plant => {
    if(plant.location){
      const distance = geolib.getDistance(plant.location, userLocation, accuracy= 1);
      plant.distance = distance
      if(minDistance === -1 || distance < minDistance){
        minDistance = distance
        closestPlant = plant
      }
    }
  });
  return closestPlant
}

export const updatePlant = async (plantId, newPlantData) => {
  await firestore().collection('plants').doc(plantId).update(newPlantData);
}