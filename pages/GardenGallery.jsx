import {ScrollView, View, Text, Image} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect} from 'react';


const GardenGallery = () => {
  const [gardenList, setGList] = useState([]);
  const [gardenNoteList, setNoteGList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true)
        let querySnapshot = await firestore().collection('gardens').get();
        const gardens = querySnapshot.docs.map(doc => {
           const data = doc.data();
           data.created_at = String(data.created_at.toDate());
           return data;
         });
        
        let querySnapshot2 = await firestore().collection('garden_notes').get();
        const garden_notes = querySnapshot2.docs.map(doc => {
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
        setNoteGList(notesWithGardenName)
        setIsLoading(false)
      };
      fetchData();
    
  }, []);

if (isLoading) {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <View
          style={{
            width: '49%',
            height: 45,
            borderRadius: 15,
            backgroundColor: '#fff',
            justifyContent: 'center',
          }}>
          <Picker style={{color: '#212121'}} selectedValue={'All Gardens'}>
            <Picker.Item
              key={'All Gardens'}
              label={'All Gardens'}
              value={'All Gardens'}
            />
          </Picker>
        </View>

        <View
          style={{
            width: '49%',
            height: 45,
            borderRadius: 15,
            backgroundColor: '#fff',
            justifyContent: 'center',
          }}>
          <Picker style={{color: '#212121'}} selectedValue={'Newest to Oldest'}>
            <Picker.Item
              key={'Newest to Oldest'}
              label={'Newest to Oldest'}
              value={'Newest to Oldest'}
            />
          </Picker>
        </View>
      </View>
      <Text>Loading...</Text>
    </View>
  );
}
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <View
          style={{
            width: '49%',
            height: 45,
            borderRadius: 15,
            backgroundColor: '#fff',
            justifyContent: 'center',
          }}>
          <Picker style={{color: '#212121'}} selectedValue={'All Gardens'}>
            <Picker.Item
              key={'All Gardens'}
              label={'All Gardens'}
              value={'All Gardens'}
            />
          </Picker>
        </View>

        <View
          style={{
            width: '49%',
            height: 45,
            borderRadius: 15,
            backgroundColor: '#fff',
            justifyContent: 'center',
          }}>
          <Picker style={{color: '#212121'}} selectedValue={'Newest to Oldest'}>
            <Picker.Item
              key={'Newest to Oldest'}
              label={'Newest to Oldest'}
              value={'Newest to Oldest'}
            />
          </Picker>
        </View>
      </View>
      <ScrollView>
        {gardenNoteList.map(n => (
          <View style= {{alignItems: 'center'}}>
            <Image
              style={{width: 150, height: 150}}
              source={{
                uri: n.image_url,
              }}></Image>
            <Text>{n.garden_name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
export default GardenGallery;
