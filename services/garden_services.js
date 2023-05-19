import firestore from '@react-native-firebase/firestore';
import {getFromStorage} from './storage';
import * as geolib from 'geolib';
import { getSortedPlantsByDistance } from './plant_services';

export const getUserGardens = async () => {
  const user_uid = await getFromStorage('userId');
  //console.log("Uid: ", user_uid)
  const userGardensRef = firestore().collection('user_gardens');
  const query = userGardensRef.where('user_uid', '==', user_uid);
  const userGardensDocs = await query.get();

  const gardenPromises = userGardensDocs.docs.map(async userGardenDoc => {
    const garden_id = userGardenDoc.data().garden_uid;
    // console.log('user garden id: ', garden_id);
    const gardenRef = firestore().collection('gardens').doc(garden_id);
    const gardenDoc = await gardenRef.get();
    const data = gardenDoc.data();
    //data.created_at = String(data.created_at.toDate());
    data.polygon = data.polygon.flat();
    return data;
  });
  const gardenList = await Promise.all(gardenPromises);
  // sort desc (gallery kısmında daha fazla sort seçeneği olacak)
  gardenList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return gardenList;
};

export const getUserGardenNames = async () =>{
  const user_uid = await getFromStorage('userId');
  const userGardensRef = firestore().collection('user_gardens');
  const query = userGardensRef.where('user_uid', '==', user_uid);
  const userGardensDocs = await query.get();

  const gardenPromises = userGardensDocs.docs.map(async userGardenDoc => {
    const garden_id = userGardenDoc.data().garden_uid;
    const gardenRef = firestore().collection('gardens').doc(garden_id);
    const gardenDoc = await gardenRef.get();
    const data = gardenDoc.data();
    return {name: data.name, id: data.id};
  });
  const gardenList = await Promise.all(gardenPromises);
  gardenList.sort();
  return gardenList;
}

export const deleteGarden = async gardenId => {
  // remove garden
  const gardenRef = firestore().collection('gardens').doc(gardenId);
  await gardenRef.delete();
  // remove relation
  const user_uid = await getFromStorage('userId');
  const userGardenQuery = firestore()
    .collection('user_gardens')
    .where('user_uid', '==', user_uid)
    .where('garden_uid', '==', gardenId);
  const querySnapshot = await userGardenQuery.get();
  querySnapshot.forEach(async doc => {
    await doc.ref.delete();
  });
  // remove garden notes
  let gardenNotesRef = await firestore()
    .collection('garden_notes')
    .where('garden_id', '==', gardenId)
    .get();
  gardenNotesRef.docs.map(async doc => {
    await doc.ref.delete()
  });
  console.log("GARDEN NOTES REMOVED")
  // remove plants
  const plant_id_list = []
  const plantsRef = firestore()
    .collection('plants')
    .where('garden_id', '==', gardenId);
  const plantQuerySnapshot = await plantsRef.get();
  plantQuerySnapshot.forEach(async doc => {
    const plant = doc.data()
    plant_id_list.push(plant.id)
    await doc.ref.delete();
  });
  console.log("PLANTS REMOVED")
  // remove plant notes
  let plantNotesRef = await firestore()
    .collection('plant_notes')
    .where('plant_id', 'in', plant_id_list)
    .get();
  plantNotesRef.docs.map(async doc => {
    await doc.ref.delete()
  });
  console.log("PLANT NOTES REMOVED")
};

export const insertGarden = async gardenData => {
  const gardenRef = firestore().collection('gardens').doc();
  await gardenRef.set({
    id: gardenRef.id,
    polygon: gardenData.polygon.map(
      coordinate =>
        new firestore.GeoPoint(coordinate.latitude, coordinate.longitude),
    ),
    ...gardenData,
  });
  // insert user garden relation
  const user_uid = await getFromStorage('userId');
  const userGardensRef = firestore().collection('user_gardens').doc();
  await userGardensRef.set({
    user_uid: user_uid,
    garden_uid: gardenRef.id,
  });
};

export const getPlantsOfGarden = async garden_id => {
  const querySnapshot = await firestore()
    .collection('plants')
    .where('garden_id', '==', garden_id)
    .get();
  const plantList = querySnapshot.docs.map(doc => {
    const data = doc.data();
    //data.created_at = String(data.created_at.toDate());
    return data;
  });
  // console.log("Plant list: ", plantList)
  return plantList;
};

// get only garden ids that currently logged-in user has
export const getUserGardenIds = async () => {
  const gardenIds = [];
  const user_uid = await getFromStorage('userId');
  const userGardensRef = firestore().collection('user_gardens');
  const query = userGardensRef.where('user_uid', '==', user_uid);
  const userGardensDocs = await query.get();
  userGardensDocs.docs.map(doc => {
    gardenIds.push(doc.data().garden_uid);
  });
  return gardenIds;
};

// kullanıcının bütün bahçelerindeki notları döndürür
export const getGardenNotes = async () => {
  const gardenIds = await getUserGardenIds();
  if(gardenIds.length == 0){
    console.log("Empty garden id list.")
    return []
  }
  let gardensRef = await firestore()
    .collection('gardens')
    .where('id', 'in', gardenIds)
    .get();

  const gardens = gardensRef.docs.map(doc => {
    const data = doc.data();
    //data.created_at = String(data.created_at.toDate());
    return data;
  });

  let gardenNotesRef = await firestore()
    .collection('garden_notes')
    .where('garden_id', 'in', gardenIds)
    .orderBy('created_at', 'desc')
    .get();
  const garden_notes = gardenNotesRef.docs.map(doc => {
    const data = doc.data();
    //data.created_at = String(data.created_at.toDate());
    return data;
  });

  let notesWithGardenName = [];
  garden_notes.forEach(note => {
    let garden = gardens.find(g => g.id === note.garden_id);
    if (garden) {
      note.garden_name = garden.name;
      notesWithGardenName.push(note);
    }
  });
  return notesWithGardenName;
};

// kullanıcının bir bahçesindeki notları döndürür
export const getGardensNoteById = async (gardenId) => {
  let gardenRef = await firestore()
    .collection('gardens')
    .doc(gardenId)
    .get();
  if(!gardenRef.exists){
    return []
  }
  const gardenName = gardenRef.data().name
  let gardenNotesRef = await firestore()
    .collection('garden_notes')
    .where('garden_id', '==', gardenId)
    .orderBy('created_at', 'desc')
    .get();

  const garden_notes = gardenNotesRef.docs.map(doc => {
    const data = doc.data();
    //data.created_at = String(data.created_at.toDate());
    return data;
  });

  let notesWithGardenName = [];
  garden_notes.forEach(note => {
    note.garden_name = gardenName;
    notesWithGardenName.push(note);
  });
  return notesWithGardenName;
}
// Ray Casting algorithm to determine whether a point is inside of given polygon
export const isInsidePolygon = (point, polygon) => {
  let x = point.latitude,
    y = point.longitude;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    let xj = polygon[j].latitude,
      yj = polygon[j].longitude;
    let intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const insertGardenNote = async gardenNote => {
  const gardenNoteRf = await firestore()
    .collection('garden_notes')
    .add(gardenNote);
  await gardenNoteRf.update({id: gardenNoteRf.id});
};

export const getSortedGardensByDistance = async (userLocation) => {
  const gardens = await getUserGardens()
  let gardensWithoutPolygon = []
  let gardensWithDistance = []
  gardens.forEach(garden => {
    polygon = garden.polygon.map(point => ({ latitude: point.latitude, longitude: point.longitude }));
    if(polygon && polygon.length > 0){
      const center = geolib.getCenter(polygon);
      const distance = geolib.getDistance(center, userLocation, accuracy= 1);
      garden.distance = distance
      gardensWithDistance.push(garden)
    }
    else{
      gardensWithoutPolygon.push(garden)
    }
  });
  const sortedGardens = gardensWithDistance.sort((a, b) => b.distance - a.distance);
  const concatenatedGardenList = sortedGardens.concat(gardensWithoutPolygon)
  return concatenatedGardenList
}

// bahçelerin bitkileri de kullanıcının konumuna yakınlığına göre sıralanır
export const getSortedGardensWithPlants = async (userLocation)=>{
  const concatenatedGardenList = await getSortedGardensByDistance(userLocation)
  let plantList = []
  if(concatenatedGardenList.length > 0){
    plantList = await getSortedPlantsByDistance(userLocation, concatenatedGardenList[0].id)
  }
  return {gardenList: concatenatedGardenList, plantList}
}

export const updateGarden = async (gardenId, newGardenData) => {
  await firestore().collection('gardens').doc(gardenId).update(newGardenData);
}