import { Image, Text, TouchableOpacity, View } from "react-native"
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu"

const GardenCard = ({ garden }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10
      }}
    >
      <View
        style={{
          width: "75%",
          backgroundColor: "#FFF1DD",
          padding: 10,
          borderRadius: 10
        }}>

        <Image
          style={{
            width: "100%",
            marginBottom: 10
          }}
          source={require("../images/default_plant.png")}>

        </Image>

        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}>

          <Text>
            {garden.name}
          </Text>


          <Menu>
            <MenuTrigger style={{}}>
              <Image
                style={{
                }}
                source={require('../images/icons/ic_options.png')}>

              </Image>
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={{ width: 150, backgroundColor: "#FFF1DD", borderRadius: 5 }}>
              <View style={{ borderColor: "#888888", borderWidth: 1 }}>
                <MenuOption onSelect={() => alert(`Edit`)}>
                  <Text style={{ textAlign: "center" }}>Edit</Text>
                </MenuOption>
                <View style={{ backgroundColor: "#888888", height: 1, width: "100%" }} />
                <MenuOption onSelect={() => alert(`Rename`)}>
                  <Text style={{ textAlign: "center" }}>Rename</Text>
                </MenuOption>
                <View style={{ backgroundColor: "#888888", height: 1, width: "100%" }} />
                <MenuOption onSelect={() => alert(`Share`)}>
                  <Text style={{ textAlign: "center" }}>Share</Text>
                </MenuOption>
                <View style={{ backgroundColor: "#888888", height: 1, width: "100%" }} />
                <MenuOption onSelect={() => alert(`Delete`)}>
                  <Text style={{ textAlign: "center", color: 'red' }}>Delete</Text>
                </MenuOption>
              </View>


            </MenuOptions>
          </Menu>


        </View>

      </View>
    </View>
  )
}

export default GardenCard