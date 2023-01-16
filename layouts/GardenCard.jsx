import { Image, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu"
import firestore from '@react-native-firebase/firestore';

// delete garden -> bu islemin digerleri gibi child componentlarda olması lazım
const deleteGarden = async (gardenId, onDelete) => {
  const ref = firestore()
    .collection('gardens')
    .doc(gardenId)
  await ref.delete(gardenId)
    .then(() => {
      ToastAndroid.show('Garden is deleted.', ToastAndroid.SHORT);
      onDelete(gardenId);
    })
    .catch((error) => {
      console.error(error);
    });
}

const GardenCard = ({ garden, onDelete }) => {
  const garden_image =
    ! garden.image_url
      ? 'https://cdn-icons-png.flaticon.com/512/3039/3039008.png'
      : garden.image_url;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
      }}>
      <View
        style={{
          width: '75%',
          backgroundColor: '#FFF1DD',
          padding: 10,
          borderRadius: 10,
        }}>
        <Image
          style={{
            width: '100%',
            height: 200,
            marginBottom: 10,
          }}
          source={{
            uri: garden_image,
          }}></Image>

        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}>

          <Text style={{color: "#212121"}}>
            {garden.name}
          </Text>


          <Menu>
            <MenuTrigger style={{}}>
              <Image
                style={{width: 22, height: 22}}
                source={require('../images/icons/ic_options.png')}>

              </Image>
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                width: 150,
                backgroundColor: '#FFF1DD',
                borderRadius: 5,
              }}>
              <View style={{borderColor: '#888888', borderWidth: 1}}>
                <MenuOption onSelect={() => alert(`Edit`)}>
                  <Text style={{textAlign: 'center', color: '#212121'}}>
                    Edit
                  </Text>
                </MenuOption>
                <View
                  style={{backgroundColor: '#888888', height: 1, width: '100%'}}
                />
                <MenuOption onSelect={() => alert(`Rename`)}>
                  <Text style={{textAlign: 'center', color: '#212121'}}>
                    Rename
                  </Text>
                </MenuOption>
                <View
                  style={{backgroundColor: '#888888', height: 1, width: '100%'}}
                />
                <MenuOption onSelect={() => alert(`Share`)}>
                  <Text style={{textAlign: 'center', color: '#212121'}}>
                    Share
                  </Text>
                </MenuOption>
                <View
                  style={{backgroundColor: '#888888', height: 1, width: '100%'}}
                />
                <MenuOption onSelect={() => deleteGarden(garden.id, onDelete)}>
                  <Text style={{textAlign: 'center', color: 'red'}}>
                    Delete
                  </Text>
                </MenuOption>
              </View>
            </MenuOptions>
          </Menu>
        </View>
      </View>
    </View>
  );
}

export default GardenCard