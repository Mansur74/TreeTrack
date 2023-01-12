import { View, Text, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";
import EmptyGardens from "../layouts/EmptyGardens";
import FilledGardens from "../layouts/FilledGardens";

const Gardens = ({ navigation }) => {
    const gardens = [{name: "My Olives", img: ""}, {name: "garden2", img: ""}, {name: "garden3", img: ""}];
    return (
        gardens.length == 0 
        ? <EmptyGardens navigation= {navigation}/> 
        : <FilledGardens navigation= {navigation} gardens ={gardens}/>
    )
}

export default Gardens