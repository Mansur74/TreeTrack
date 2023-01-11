import { View, Text, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";
import EmptyGardens from "../layouts/EmptyGardens";
import FilledGardens from "../layouts/FilledGardens";

const Gardens = ({ navigation }) => {
    const gardens = ["garden1, garden2"];
    return (
        gardens.length == 0 
        ? <EmptyGardens navigation= {navigation}/> 
        : <FilledGardens navigation= {navigation} gardens ={gardens}/>
    )
}

export default Gardens