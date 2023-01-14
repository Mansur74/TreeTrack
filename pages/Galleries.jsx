import { View, Text, TouchableOpacity } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { Picker } from '@react-native-picker/picker';

const Galleries = () => {
  return (

    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF"]}
      style={{ height: "100%" }}
    >
      <View style={{ flex: 1 }}>

        <View style={{
          padding: 20,
          flex: 3,
        }}>
          <Text style={{ fontSize: 30, color: "white", fontWeight: "bold", color: "#09A555", marginBottom: 10 }}>
            gallery
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <View
              style={{
                flexDirection: "row", padding: 5, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#09A555"
              }}>


              <TouchableOpacity
                style={{
                  width: 100,
                  padding: 5,
                  backgroundColor: "#25596E",
                  borderRadius: 5
                }}
              >
                <Text style={styles.bt1}> Garden </Text>
              </TouchableOpacity>


              <View
                style={{ backgroundColor: "#FFFFFF50", width: 2, height: 25, marginStart: 5, marginEnd: 5 }}>

              </View>

              <TouchableOpacity
                style={{
                  width: 100,
                  padding: 5,
                  borderRadius: 5

                }}
              >
                <Text style={styles.bt1}> Plant </Text>
              </TouchableOpacity>


            </View>



          </View>

        </View>

        <View style={{
          padding: 20,
          flex: 20,
          backgroundColor: "#89C6A7",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50
        }}>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between", padding: 20 }}>

                        <View
                            style={{
                                width: '48%',
                                height: 45,
                                borderRadius: 50,
                                backgroundColor: '#fff',
                                justifyContent: "center"
                            }}>
                            <Picker
                            style={{color: '#212121'}}
                                selectedValue={"All Gardens"}>
                                <Picker.Item key={"All Gardens"} label={"All Gardens"} value={"All Gardens"}/>

              </Picker>


            </View>

                        <View
                            style={{
                                width: '48%',
                                height: 45,
                                borderRadius: 50,
                                backgroundColor: '#fff',
                                justifyContent: "center"
                            }}>
                            <Picker
                                style={{color: '#212121'}}
                                selectedValue={"Newest to Oldest"}>
                                <Picker.Item key={"Newest to Oldest"} label={"Newest to Oldest"} value={"Newest to Oldest"}/>

              </Picker>


            </View>



          </View>

        </View>

      </View>

    </LinearGradient>


  )
}

export default Galleries