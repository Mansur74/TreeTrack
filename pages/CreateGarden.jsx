import {View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import MapView, {PROVIDER_GOOGLE, Polygon} from 'react-native-maps';

const CreateGarden = () => {
  const coordinates = [
    {latitude: 37.8025259, longitude: -122.4351431},
    {latitude: 37.7896386, longitude: -122.421646},
    {latitude: 37.7665248, longitude: -122.4275672},
    {latitude: 37.7734153, longitude: -122.4525175},
    {latitude: 37.7948605, longitude: -122.4596065},
  ];

  return (
    <LinearGradient
      colors={['#D1A96DE5', '#DB966FE5']}
      style={{height: '100%'}}>
      <View style={{padding: 20, flex: 1, marginBottom: 110}}>
        <Text style={styles.text}>Add a new garden</Text>

        <Text
          style={{
            fontSize: 15,
            color: '#FFF1DD',
          }}>
          Add a photo of your garden
        </Text>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Polygon coordinates={coordinates} />
        </MapView>
      </View>
    </LinearGradient>
  );
};

export default CreateGarden;
