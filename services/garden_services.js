import firestore from '@react-native-firebase/firestore';
import {getFromStorage} from './storage';
import * as geolib from 'geolib';
import { getSortedPlantsByDistance } from './plant_services';

export const getUserGardens = async (getLastImage = false) => {
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
  // get last image of the garden if it's wanted
  if(getLastImage){
    const gardenImagesPromises = gardenList.map(async (garden) => {
      // get last image
      const notDoc = await firestore().collection("garden_notes").where("garden_id", "==", garden.id).orderBy("created_at", "desc").get()
      const data = notDoc.docs.map(d => {return d.data()})
      return {garden_id: garden.id, data}
    })
    const gardenImageList = await Promise.all(gardenImagesPromises)
    // add images to garden items
    gardenList.forEach(garden => {
      const gardenImage = gardenImageList.find(i => i.garden_id == garden.id)
      if(gardenImage && gardenImage.data.length !== 0){
        garden.image_url = gardenImage.data[0].image_url
      }
    });
    for(let i = 0; i<gardenList.length; i++){
      const gardenEntity = gardenList[i]
      const gardenNotes = gardenImageList.find(i => i.garden_id == gardenEntity.id)
      if(gardenNotes && gardenNotes.data != null && gardenNotes.data.length !== 0){
        // find the latest uploaded image from notes
        for(let j = 0; j<gardenNotes.data.length; j++){
          const g_note =  gardenNotes.data[j]
          if(g_note.image_url !== null){
            gardenEntity.image_url = g_note.image_url
            break
          }
        }
      }
    }
  }
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
  let plantCollection = await firestore().collection("plants")
  const plantBatches = [];
  while (plant_id_list.length) {
    const batch = plant_id_list.splice(0, 10);
    plantBatches.push(plantCollection.where('plant_id', 'in', [...batch]).get().then(results => results.docs.map(async doc => {
      await doc.ref.delete()
    } )))
  }
  await Promise.all(plantBatches)
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

export const getPlantsOfGarden = async (garden_id, getLastImage) => {
  const querySnapshot = await firestore()
    .collection('plants')
    .where('garden_id', '==', garden_id)
    .orderBy("created_at", "desc")
    .get();
  const plantList = querySnapshot.docs.map(doc => {
    const data = doc.data();
    //data.created_at = String(data.created_at.toDate());
    return data;
  });
    // get last image of the plant if it's wanted
  if(getLastImage){
    const plantImagesPromises = plantList.map(async (plant) => {
      // get last image
      const notDoc = await firestore().collection("plant_notes").where("plant_id", "==", plant.id).orderBy("created_at", "desc").get()
      const data = notDoc.docs.map(d => {return d.data()})
      return {plant_id: plant.id, data}
    })
    const plantImageList = await Promise.all(plantImagesPromises)
    // add images to plant items
    for(let i = 0; i<plantList.length; i++){
      const plant = plantList[i]
      const plantImage = plantImageList.find(i => i.plant_id == plant.id)
      if(plantImage && plantImage.data != null && plantImage.data.length !== 0){
        // find the latest uploaded image from notes
        for(let j = 0; j<plantImage.data.length; j++){
          const p_note =  plantImage.data[j]
          if(p_note.image_url !== null){
            plant.image_url = p_note.image_url
            break
          }
        }
      }
    }
  }
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
  const gardenIdsForNote = JSON.parse(JSON.stringify(gardenIds))
  if(gardenIds.length == 0){
    console.log("Empty garden id list.")
    return []
  }
  // get gardens
  let gardensCollection = await firestore().collection('gardens')
  const gardenBatches = [];
  while (gardenIds.length) {
    const batch = gardenIds.splice(0, 10);
    gardenBatches.push(gardensCollection.where('id', 'in', [...batch]).get().then(results => results.docs.map(result => ({...result.data() }) )))
  }
  const gardens = await Promise.all(gardenBatches).then(content => {
    return content.flat()
  });

  // get garden notes
  let gardenNotesCollection = await firestore().collection("garden_notes")
  const gardenNoteBatches = [];
  while (gardenIdsForNote.length) {
    const batch = gardenIdsForNote.splice(0, 10);
    gardenNoteBatches.push(gardenNotesCollection.where('garden_id', 'in', [...batch]).orderBy("created_at", "desc").get().then(results => results.docs.map(result => ({...result.data() }) )))
  }
  const notesWithGardenName = []
  await Promise.all(gardenNoteBatches).then(content => {
    content.flat().forEach(gardenNoteData => {
      const garden = gardens.find(g => g.id === gardenNoteData.garden_id)
      if (garden) {
        gardenNoteData.garden_name = garden.name;
        notesWithGardenName.push(gardenNoteData);
      }
    })
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
  const sortedGardens = gardensWithDistance.sort((a, b) => a.distance - b.distance);
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
// kullanıcının bahçesi yoksa true döner
export const isEmptyGarden = async ()=>{
  const user_uid = await getFromStorage('userId');
  //console.log("Uid: ", user_uid)
  const userGardensRef = firestore().collection('user_gardens');
  const query = userGardensRef.where('user_uid', '==', user_uid);
  const isEmpty = (await query.get()).empty;
  return isEmpty
}