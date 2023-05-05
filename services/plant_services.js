import firestore from '@react-native-firebase/firestore';
import { getUserGardenIds } from './garden_services';

export const getPlantNotes = async () => {
  const gardenIds = await getUserGardenIds();
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
