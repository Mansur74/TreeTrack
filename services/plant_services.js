import firestore from '@react-native-firebase/firestore';
import { getPlantsOfGarden, getUserGardenIds } from './garden_services';
import * as geolib from 'geolib';

export const getPlantNotes = async () => {
  const gardenIds = await getUserGardenIds();
  if(gardenIds.length == 0){
    console.log("Empty garden id list.")
    return []
  }
  const plantIds = [];
  let plantsRef = await firestore()
    .collection('plants')
    .where('garden_id', 'in', gardenIds)
    .get();
  const plants = plantsRef.docs.map(doc => {
    const data = doc.data();
    data.created_at = String(data.created_at.toDate());
    plantIds.push(data.id);
    return data;
  });

  let plantNoteRefs = await firestore()
    .collection('plant_notes')
    .where('plant_id', 'in', plantIds)
    .orderBy('created_at', 'desc')
    .get();
  const plant_notes = plantNoteRefs.docs.map(doc => {
    const data = doc.data();
    data.created_at = String(data.created_at.toDate());
    return data;
  });

  let notesWithPlantName = [];
  plant_notes.forEach(note => {
    let plant = plants.find(p => p.id === note.plant_id);
    if (plant) {
      note.plant_name = plant.name;
      notesWithPlantName.push(note);
    }
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