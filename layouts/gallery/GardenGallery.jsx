import {ScrollView, View, Text, Image, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect} from 'react';


const GardenGallery = () => {
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

  const displayNote = item => {
    console.log("Garden note: ", item);
    // TODO: show Modal
  };
if (isLoading) {
  return (
    <View>
      {/* order options */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
          paddingVertical: 10,
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
              key={'All Plants'}
              label={'All Plants'}
              value={'All Plants'}
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
      <Text style={{color: '#efefef', padding: 10}}>Loading...</Text>
    </View>
  );
}
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
          paddingVertical: 10
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
      {/* plant note section */}
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            marginBottom: 150,
          }}>
          {gardenNoteList.map(item => (
            <TouchableOpacity
              style={{
                width: '47%',
                alignItems: 'center',
                backgroundColor: '#efefef70',
                padding: 5,
                margin: 5,
                borderRadius: 5,
              }}
              key={item.id}
              onPress={() => {
                displayNote(item);
              }}>
              <Image
                style={{width: 150, height: 150}}
                source={
                  item.image_url == null
                    ? require('../../images/default_plant.png')
                    : {uri: item.image_url}
                }></Image>
              <Text style={{color: '#212121'}}>{item.garden_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default GardenGallery;
