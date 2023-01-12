import { Picker } from '@react-native-picker/picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import DrawPoligon from './DrawPoligon';

const Stack = createNativeStackNavigator()

const CreateGarden = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{ height: '100%' }}>
      <View style={{ padding: 20, flex: 1, marginBottom: 110 }}>

        <Text style={{
          fontSize: 30,
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: 10,
        }}>add a new garden</Text>

        <ScrollView>
          <View
            style={{
              padding: 10,
              width: "85%",
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#FFFFFF',
                marginBottom: 5
              }}>
              Add a photo of your garden
            </Text>

            <TouchableOpacity
              style={{
                height: 150,
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
                marginBottom: 10
              }}>
              <Image
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0
                }}
                source={require('../images/icons/ic_add_image.png')}
              >

              </Image>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 16,
                color: '#FFFFFF',
                marginBottom: 5
              }}>
              Give a name to your garden
            </Text>

        
            <View
              style={{
                borderRadius: 10,
                backgroundColor: '#fff',
                marginBottom: 10

              }}>
              <Picker
                style={{ color: "#5F5F5F" }}
                selectedValue={"Farm"}
              >
                <Picker.Item key={"Farm"} label={"Farm"} value={"Farm"} />
              </Picker>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: '#FFFFFF',
                marginBottom: 5
              }}>
              Add location of your garden
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                marginBottom: 10,
                padding: 10,
                alignSelf: 'baseline'
              }}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    marginEnd: 5
                  }}
                  source={require('../images/icons/ic_map.png')}
                >
                </Image>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#5F5F5F"
                  }}>
                  Open Map
                </Text>
              </View>
            </TouchableOpacity>

          </View>

          <View
            style={{
              padding: 10,
            }}>

            <Text
              style={{
                fontSize: 16,
                color: '#FFFFFF',
                marginBottom: 5
              }}>
              Add garden notes
            </Text>

            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Garden notes"
              style={{
                height: 150,
                backgroundColor: '#D9D9D9',
                borderRadius: 10,
                borderWidth: 0,
                color: '#C4C4C4',
                padding: 10,
                elevation: 10,
                marginBottom: 20
              }}
            />

            <TouchableOpacity
            onPress={() => {
              navigation.navigate("DrawPoligon")
            }}
              style={{
                backgroundColor: '#44A77A',
                fontWeight: 'bold',
                alignSelf: 'flex-end',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 20,
                paddingRight: 20,
                borderRadius: 20
              }}>
              <Text style={styles.bt1}> Save </Text>
            </TouchableOpacity>


          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default CreateGarden;
