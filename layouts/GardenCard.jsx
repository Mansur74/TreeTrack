import { Dimensions, Image, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu"
import { deleteGarden } from "../services/garden_services";

const {height} = Dimensions.get("window")
// delete garden -> bu islemin digerleri gibi child componentlarda olması lazım
const handleDelete = async (gardenId, onUpdate) => {
  try {
    await deleteGarden(gardenId);
    ToastAndroid.show('Garden is deleted.', ToastAndroid.SHORT);
    onUpdate();
  } catch (error) {
    console.log("Delete garden error: ", error)
  }
}

const GardenCard = ({ navigation, garden, onUpdate }) => {
  const garden_image =
    !garden.image_url
      ? 'https://cdn-icons-png.flaticon.com/512/3039/3039008.png'
      : garden.image_url;
  return (
    <TouchableOpacity
      onPress={()=>{navigation.navigate("ViewGarden", {garden, onUpdate})}}>
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
              height: height * 0.25,
              marginBottom: 10,
            }}
            source={{
              uri: garden_image,
            }}></Image>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>

            <Text style={{ color: "#212121" }}>
              {garden.name}
            </Text>


            <Menu>
              <MenuTrigger style={{}}>
                <Image
                  style={{ width: 22, height: 22 }}
                  source={require('../images/icons/ic_options.png')}>

                </Image>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  width: 150,
                  backgroundColor: '#FFF1DD',
                  borderRadius: 5,
                }}>
                <View style={{ borderColor: '#888888', borderWidth: 1 }}>
                  <MenuOption onSelect={() => navigation.navigate("EditGarden", {garden, onUpdate})}>
                    <Text style={{ textAlign: 'center', color: '#212121' }}>
                      Edit
                    </Text>
                  </MenuOption>
                  <View
                    style={{ backgroundColor: '#888888', height: 1, width: '100%' }}
                  />
                  {/* <MenuOption onSelect={() => alert(`Rename`)}>
                    <Text style={{ textAlign: 'center', color: '#212121' }}>
                      Rename
                    </Text>
                  </MenuOption> */}
                  <View
                    style={{ backgroundColor: '#888888', height: 1, width: '100%' }}
                  />
                  <MenuOption onSelect={() => alert(`Share`)}>
                    <Text style={{ textAlign: 'center', color: '#212121' }}>
                      Share
                    </Text>
                  </MenuOption>
                  <View
                    style={{ backgroundColor: '#888888', height: 1, width: '100%' }}
                  />
                  <MenuOption onSelect={() => handleDelete(garden.id, onUpdate)}>
                    <Text style={{ textAlign: 'center', color: 'red' }}>
                      Delete
                    </Text>
                  </MenuOption>
                </View>
              </MenuOptions>
            </Menu>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default GardenCard