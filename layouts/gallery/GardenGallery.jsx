import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect} from 'react';
import styles from "../../styles/Style";


const formatDate = (date) => {
  if (date != null && date.split(' ').length > 3)
    return date.split(' ').slice(0, 4).join(' ');
  return date  
}
const GardenGallery = () => {
  const [gardenNoteList, setNoteGList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pressedItem, setPressedItem] = useState({});
  useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true)
        let querySnapshot = await firestore().collection('gardens').get();
        const gardens = querySnapshot.docs.map(doc => {
           const data = doc.data();
           data.created_at = String(data.created_at.toDate());
           return data;
         });
        
        let querySnapshot2 = await firestore()
          .collection('garden_notes')
          .orderBy('created_at', 'desc')
          .get();
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
    
    setPressedItem(item)
    setModalVisible(true)
    console.log('Garden note: ', pressedItem);
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
                backgroundColor: '#ffffff80',
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
                    ? require('../../images/default_garden.jpg')
                    : {uri: item.image_url}
                }></Image>
              <Text style={{color: '#212121', marginTop: 5}}>{item.garden_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* modal */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            visible={modalVisible}
            presentationStyle="fullScreen"
            onRequestClose={() => {
              console.log('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={[styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={{color: '#fff', paddingTop: 2, fontWeight: '300'}}>x</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontWeight: '500',
                    marginBottom: 10,
                  }}>
                  {pressedItem.garden_name}
                </Text>
                <Image
                  style={{width: 250, height: 250, borderRadius: 8}}
                  source={
                    pressedItem.image_url == null
                      ? require('../../images/default_garden.jpg')
                      : {uri: pressedItem.image_url}
                  }
                />
                <Text
                  style={{
                    color: '#212121',
                    marginVertical: 15,
                    textAlign: 'justify',
                  }}>
                  {pressedItem.note}
                </Text>
                <Text
                  style={{
                    color: '#21212190',
                    alignSelf: 'flex-end',
                    marginRight: 8,
                    marginVertical: 15,
                    fontStyle: 'italic',
                  }}>
                  {formatDate(pressedItem.created_at)}{' '}
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
  
};

export default GardenGallery;
