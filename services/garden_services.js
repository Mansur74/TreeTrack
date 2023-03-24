import firestore from '@react-native-firebase/firestore';
import { getFromStorage } from './storage';


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
export const deleteGarden = async (gardenId) => {
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

export const insertGarden = async (gardenData) =>{
  const gardenRef = firestore().collection('gardens').doc();
  await gardenRef
    .set({
      id: gardenRef.id,
      polygon: gardenData.polygon.map(
        coordinate =>
          new firestore.GeoPoint(coordinate.latitude, coordinate.longitude),
      ),
      ...gardenData,
    })
  // insert user garden relation
  const user_uid = await getFromStorage('userId');
  const userGardensRef = firestore().collection('user_gardens').doc();
  await userGardensRef.set({
    user_uid: user_uid,
    garden_uid: gardenRef.id
  })
}