import {ScrollView, View, Text, Image, TouchableOpacity, Modal} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect} from 'react';
import styles from '../../styles/Style';
import { getPlantNotes } from '../../services/plant_services';


const formatDate = date => {
  if (date != null && date.split(' ').length > 3)
    return date.split(' ').slice(0, 4).join(' ');
  return date;
};

const PlantGallery = () => {
  const [plantNoteList, setNoteList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pressedItem, setPressedItem] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const plantNotes = await getPlantNotes()
      setNoteList(plantNotes);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  
  const displayNote = (item) => {
    setPressedItem(item);
    setModalVisible(true);
    console.log("Plant note: ", pressedItem)
    // TODO: show Modal
  }
  
  if (isLoading || plantNoteList.length == 0) {
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
            <Picker
              style={{color: '#212121'}}
              selectedValue={'Newest to Oldest'}>
              <Picker.Item
                key={'Newest to Oldest'}
                label={'Newest to Oldest'}
                value={'Newest to Oldest'}
              />
            </Picker>
          </View>
        </View>       
      {isLoading && <Text style={{color: '#efefef', padding: 10}}>Loading...</Text>}
      {!isLoading && plantNoteList.length == 0 && <Text style={{color: '#efefef', padding: 10}}>You do not have any plant note.</Text>}
      </View>
    );
  }
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
      {/* plant note section */}
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            marginBottom: 150,
          }}>
          {plantNoteList.map(item => (
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
                    ? require('../../images/default_plant.png')
                    : {uri: item.image_url}
                }></Image>
              <Text style={{color: '#212121', marginTop: 5}}>{item.plant_name}</Text>
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
                  <Text
                    style={{color: '#fff', paddingTop: 2, fontWeight: '300'}}>
                    x
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontWeight: '500',
                    marginBottom: 10,
                  }}>
                  {pressedItem.plant_name}
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
export default PlantGallery;
