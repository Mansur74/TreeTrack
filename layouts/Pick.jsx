import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/Style';

const Pick = ({ unPick }) => {
    return (
        <View style={{ alignItems: "center" }}>
            <Image
                source={require("../images/default_plant.png")}
                style={{ marginBottom: 20 }}
            >

            </Image>
            <TouchableOpacity onPress={unPick} style={styles.button}>
                <Text style={styles.bt1}> Select Another Picture </Text>
            </TouchableOpacity>
        </View>


    );
};

export default Pick;