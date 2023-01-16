import {View} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const PlantGallery = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
      }}>
      <View
        style={{
          width: '49%',
          height: 45,
          borderRadius: 15,
          backgroundColor: '#fff',
          justifyContent: 'center',
        }}>
        <Picker style={{color: '#212121'}} selectedValue={'All Gardens'}>
          <Picker.Item
            key={'All Plants'}
            label={'All Plants'}
            value={'All Plants'}
          />
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
        <Picker style={{color: '#212121'}} selectedValue={'Newest to Oldest'}>
          <Picker.Item
            key={'Newest to Oldest'}
            label={'Newest to Oldest'}
            value={'Newest to Oldest'}
          />
        </Picker>
      </View>
    </View>
  );
};
export default PlantGallery;
