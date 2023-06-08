import {View, Text, TouchableOpacity, Image, ScrollView, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useState} from 'react';
import styles from '../styles/Style';
import {getPlantNotesById} from '../services/plant_services';
import {formatDate} from '../services/helper';

const ViewGarden = ({navigation, route}) => {
    const {height} = Dimensions.get("window")
  const plant = route.params.plant;
  const garden = route.params.garden;
  const onUpdate = route.params.onUpdate;
  const [plantNotes, setPlantNotes] = useState([]);
  const [imageIdx, setImageIdx] = useState(0);
  const [isArrowPressed, setPressed] = useState(false);
  const [numberOfLines, setLines] = useState(3);
  if (plant.plant_type.plant_type) {
    let pt = plant.plant_type.plant_type;
    plant.plant_type = pt;
  }
  useEffect(() => {
    const fetchData = async () => {
      const notes = await getPlantNotesById(plant.id);
      setPlantNotes(notes);
    };
    fetchData();
  }, []);
  const plantImages = [];
  const plantNotesWithoutImage = [];
  plantNotes.forEach(note => {
    if (note.image_url !== null) plantImages.push(note);
    else plantNotesWithoutImage.push(note);
  });

  /*if (plantImages.length > 0 && !isArrowPressed) {
    setTimeout(() => {
      if (imageIdx + 1 === plantImages.length) {
        setImageIdx(0);
      } else {
        setImageIdx(imageIdx + 1);
      }
    }, 4000);
  }*/

  const plant_image = !plant.image_url
    ? 'https://cdn-icons-png.flaticon.com/512/3039/3039008.png'
    : plant.image_url;
  return (
    <LinearGradient colors={['#89C6A7', '#89C6A7']} style={{height: '100%'}}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 5,
          }}>
          <Text style={styles.text}>{plant.name}</Text>
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              navigation.navigate('EditPlant', {plant, garden, onUpdate});
            }}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../images/icons/edit.png')}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: 16,
            marginBottom: 15,
            color: '#efefef',
            paddingHorizontal: 20,
          }}>
          <Text style={{fontWeight: 'bold'}}>Plant Type: </Text>
          {!plant.plant_type || plant.plant_type === ''
            ? 'Undefined'
            : plant.plant_type}
        </Text>
        {plantNotes.length == 0 && (
          <Text style={{color: '#efefef', fontSize: 16, textAlign: 'center'}}>
            This plant does not have any note.
          </Text>
        )}
        {plantNotes.length > 0 && (
          <ScrollView
            style={{paddingHorizontal: 20}}
            nestedScrollEnabled={true}>
            {/* plant notes with image */}
            {plantImages.length > 0 && (
              <View
                style={{
                  backgroundColor: '#ffffff20',
                  paddingTop: 5,
                  padding: 10,
                }}>
                {/* image slider */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setPressed(true);
                      if (imageIdx - 1 === -1) {
                        setImageIdx(plantImages.length - 1);
                      } else {
                        setImageIdx(imageIdx - 1);
                      }
                    }}
                    style={{
                      backgroundColor: '#2c3d4f',
                      paddingTop: 15,
                      paddingBottom: 18,
                      borderRadius: 40,
                      paddingHorizontal: 5,
                      marginRight: 5,
                    }}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>
                      &lt;
                    </Text>
                  </TouchableOpacity>
                  <Image
                    style={{width: '90%', height:height*0.35, borderRadius: 10}}
                    resizeMode='cover'
                    source={{
                      uri:
                        plantImages.length === 0
                          ? plant_image
                          : plantImages[imageIdx].image_url,
                    }}></Image>
                  <TouchableOpacity
                    onPress={() => {
                      setPressed(true);
                      if (imageIdx + 1 === plantImages.length) {
                        setImageIdx(0);
                      } else {
                        setImageIdx(imageIdx + 1);
                      }
                    }}
                    style={{
                      backgroundColor: '#2c3d4f',
                      paddingTop: 15,
                      paddingBottom: 18,
                      borderRadius: 40,
                      paddingHorizontal: 5,
                      marginLeft: 5,
                    }}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>
                      &gt;
                    </Text>
                  </TouchableOpacity>
                </View>
                {plantImages.length > 0 && (
              <TouchableOpacity
                onPress={()=>{
                    setLines(numberOfLines === 3 ? undefined : 3)
                    setPressed(true)
                }}
                key={plantImages[imageIdx].id}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: '#2c3d4f15',
                  borderRadius: 5,
                  width: '90%',
                  alignSelf: 'center',
                }}>
                <Text style={{color: 'white'}} numberOfLines={numberOfLines}>
                  <Text style={{fontWeight: 'bold'}}>
                    [{formatDate(plantImages[imageIdx].created_at)}]{' '}
                  </Text>
                  {plantImages[imageIdx].note}
                </Text>
              </TouchableOpacity>
            )}
              </View>
            )}

            {/* plant notes without image */}
            {plantNotesWithoutImage.length > 0 && (
              <View
                style={{
                  backgroundColor: '#ffffff20',
                  marginTop: 10,
                  marginBottom: 5,
                  paddingHorizontal: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginVertical: 8,
                    alignSelf: 'center',
                  }}>
                  {plantImages.length > 0 ? "Other ": ""}Plant Notes
                </Text>

                <ScrollView nestedScrollEnabled={true}>
                  {plantNotesWithoutImage.map(note => (
                    <View
                      key={note.id}
                      style={{
                        padding: 10,
                        backgroundColor: '#2c3d4f15',
                        borderRadius: 5,
                        marginBottom: 5,
                      }}>
                      <Text style={{color: 'white'}}>
                        <Text style={{fontWeight: 'bold'}}>
                          [{formatDate(note.created_at)}]{' '}
                        </Text>
                        {note.note}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        )}

        <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: 110
            }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Galleries', {plant, showGarden: false});
            }}
            style={{...styles.button_right, marginLeftt: 10}}>
            <Text style={styles.bt1}> View in Gallery </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ViewGarden;
