import { View, Text, TouchableOpacity, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";

const Settings = ({navigation}) => {
  return (

    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF"]}
      style={{ height: "100%" }}
    >
      <View style={{ flex: 1 }}>

        <View style={{
          padding: 20,
          flex: 2,
        }}>
          <Text style={{ fontSize: 30, color: "white", fontWeight: "bold", color: "#09A555" }}>
            settings
          </Text>

        </View>
        <View style={{
          padding: 20,
          flex: 15,
          backgroundColor: "#89C6A7",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile")
            }}
            style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: "#FFFFFF",
              marginBottom: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text style={{ color: "#25596E" }}> Profile </Text>

              <Image
                style={{
                  marginEnd: 5
                }}
                source={require('../images/icons/ic_right_arrow.png')}
              >
              </Image>

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: "#FFFFFF",
              marginBottom: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text style={{ color: "#25596E" }}> Preferences </Text>

              <Image
                style={{
                  marginEnd: 5
                }}
                source={require('../images/icons/ic_right_arrow.png')}
              >
              </Image>

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: "#FFFFFF",
              marginBottom: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text style={{ color: "#25596E" }}> Privacy and Safety </Text>

              <Image
                style={{
                  marginEnd: 5
                }}
                source={require('../images/icons/ic_right_arrow.png')}
              >
              </Image>

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: "#FFFFFF",
              marginBottom: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text style={{ color: "#25596E" }}> Notifications </Text>

              <Image
                style={{
                  marginEnd: 5
                }}
                source={require('../images/icons/ic_right_arrow.png')}
              >
              </Image>

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: "#FFFFFF",
              marginBottom: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text style={{ color: "#25596E" }}> Support </Text>

              <Image
                style={{
                  marginEnd: 5
                }}
                source={require('../images/icons/ic_right_arrow.png')}
              >
              </Image>

            </View>
          </TouchableOpacity>

        </View>

      </View>

    </LinearGradient>

  )
}

export default Settings