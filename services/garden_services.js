import firestore from '@react-native-firebase/firestore';
import {getFromStorage} from './storage';

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
    data.created_at = String(data.created_at.toDate());
    data.polygon = data.polygon.flat();
    return data;
  });
  const gardenList = await Promise.all(gardenPromises);
  // sort desc (gallery kısmında daha fazla sort seçeneği olacak)
  gardenList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return gardenList;
};

// todo: garden'a ait bitkiler, resimler ve notlar da silinmeli
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
    data.created_at = String(data.created_at.toDate());
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

export const getGardenNotes = async () => {
  const gardenIds = await getUserGardenIds();

  let gardensRef = await firestore()
    .collection('gardens')
    .where('id', 'in', gardenIds)
    .get();

  const gardens = gardensRef.docs.map(doc => {
    const data = doc.data();
    data.created_at = String(data.created_at.toDate());
    return data;
  });

  let gardenNotesRef = await firestore()
    .collection('garden_notes')
    .where('garden_id', 'in', gardenIds)
    .orderBy('created_at', 'desc')
    .get();
  const garden_notes = gardenNotesRef.docs.map(doc => {
    const data = doc.data();
    data.created_at = String(data.created_at.toDate());
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
