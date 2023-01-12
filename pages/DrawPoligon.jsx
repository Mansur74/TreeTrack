import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';

const DrawPoligon = ({navigation}) => {
  const coordinates = [
    { latitude: 37.8025259, longitude: -122.4351431 },
    { latitude: 37.7896386, longitude: -122.421646 },
    { latitude: 37.7665248, longitude: -122.4275672 },
    { latitude: 37.7734153, longitude: -122.4525175 },
    { latitude: 37.7948605, longitude: -122.4596065 },
  ];

  return (
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{ height: '100%' }}>
      <View style={{ padding: 20, flex: 1, marginBottom: 110 }}>
        <Text style={styles.text}>add location</Text>

        <Text
          style={{
            fontSize: 15,
            color: '#FFF1DD',
          }}>
          Tab to select corners of your garden
        </Text>

        <View
          style={{
            flexDirection:'row' , 
            alignItems:'center', 
            backgroundColor: "#FFFFFF",
            borderRadius: 10, 
            justifyContent: "space-between", 
            paddingLeft: 10, 
            paddingRight: 10, 
            marginBottom: 10
          }}>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Search..."
            style={{
              height: 40,
              color: '#C4C4C4',
            }}
          />

          <Image
            style={{
              height: 20,
              width: 20,
              marginEnd: 5
            }}
            source={require('../images/icons/ic_search.png')}
          >
          </Image>
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Polygon coordinates={coordinates} />
        </MapView>

        <TouchableOpacity
            onPress={() => {
              navigation.navigate("Gardens")
            }}
              style={{
                backgroundColor: '#44A77A',
                fontWeight: 'bold',
                alignSelf: 'flex-end',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 20,
                paddingRight: 20,
                borderRadius: 20,
                marginTop: 10
              }}>
              <Text style={styles.bt1}> Save Area </Text>
            </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default DrawPoligon;
