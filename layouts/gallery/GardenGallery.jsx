import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect} from 'react';
import styles from "../../styles/Style";
import { getGardenNotes, getUserGardenNames } from '../../services/garden_services';
import { formatDate, sortNoteList } from '../../services/helper';

const GardenGallery = ({selectedGarden}) => {
  console.log("selected garden: ", selectedGarden) // TODO - view in gallery
  const [gardenNoteList, setNoteList] = useState([]);
  const [filteredNoteList, setFilteredNoteList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pressedItem, setPressedItem] = useState({});
  const [gardenNames, setGardenNames] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const gardenNotes = await getGardenNotes()
      setNoteList(gardenNotes)
      setFilteredNoteList(gardenNotes)
      setIsLoading(false)
    };
    fetchData();
    
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const gardenNames = await getUserGardenNames()
      setGardenNames(gardenNames)
      setIsLoading(false)
    }
    fetchData()
  }, []);

  const displayNote = item => {
    
    setPressedItem(item)
    setModalVisible(true)
    console.log('Garden note: ', pressedItem);

  };

  const sortOptions = [{name: "Newest to Oldest", id: 1}
                      ,{name: "Oldest to Newest", id: 2}
                      ,{name: "Garden Names", id: 3}]
  const [sortOptionPickerValue, setSortOptionPicker] = useState(sortOptions[0])
  const filterOptions = [{name: "All Gardens", id: 1}, ...gardenNames]
  const [filterOptionPickerValue, setFilterOptionPicker] = useState(filterOptions[0])
  
  const onFilterPickerChange = (itemValue) => {
    setFilterOptionPicker(itemValue);
    if(itemValue === 1){
      setFilteredNoteList(gardenNoteList)
    }else{
      setFilteredNoteList(gardenNoteList.filter(note => {return note.garden_id == itemValue}))
    }
  }

  const onSortOptionChange = (itemValue) => {
    setSortOptionPicker(itemValue)
    let sortedNotes = sortNoteList(filteredNoteList, itemValue, 'garden')
    setFilteredNoteList(sortedNotes)
  }

if (isLoading || filteredNoteList.length == 0) {
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
            <Picker
              dropdownIconRippleColor={'rgba(202, 255, 222, 0.56)'}
              dropdownIconColor={'#21212110'}
              style={{color: '#212121'}}
              selectedValue={filterOptionPickerValue}
              onValueChange={itemValue => onFilterPickerChange(itemValue)}>
              {filterOptions.map(filter => (
                <Picker.Item
                  key={filter.id}
                  label={filter.name}
                  value={filter.id}
                />
              ))}
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
          <Picker style={{color: '#212121'}} selectedValue={sortOptionPickerValue}>
            {sortOptions.map(sort => (
              <Picker.Item
                key={sort.id}
                label={sort.name}
                value={sort.id}
              />
            ))}
          </Picker>
        </View>
      </View>
      {isLoading && <Text style={{color: '#efefef', padding: 10}}>Loading...</Text>}
      {!isLoading && filteredNoteList.length == 0 && <Text style={{color: '#efefef', padding: 10}}>You do not have any garden note.</Text>}
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
            <Picker
              dropdownIconRippleColor={'rgba(202, 255, 222, 0.56)'}
              dropdownIconColor={'#21212110'}
              style={{color: '#212121'}}
              selectedValue={filterOptionPickerValue}
              onValueChange={itemValue => onFilterPickerChange(itemValue)}>
              {filterOptions.map(filter => (
                <Picker.Item
                  key={filter.id}
                  label={filter.name}
                  value={filter.id}
                />
              ))}
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
          <Picker style={{color: '#212121'}} 
            selectedValue={sortOptionPickerValue}
            onValueChange={itemValue => onSortOptionChange(itemValue)}>
            {sortOptions.map(sort => (
              <Picker.Item
                key={sort.id}
                label={sort.name}
                value={sort.id}
              />
            ))}
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
          {filteredNoteList.map(item => (
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
                    ? require('../../images/default_garden.png')
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
                      ? require('../../images/default_garden.png')
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
