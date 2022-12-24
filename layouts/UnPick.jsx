import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/Style';

const UnPick = ({pick}) => {
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={styles.t4}>
                Take a photo of your plant or select it from your gallery.
            </Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.bt1}> Open Camera </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pick} style={styles.button}>
                <Text style={styles.bt1}> Select from Gallery </Text>
            </TouchableOpacity>
        </View>
    );
};

export default UnPick;