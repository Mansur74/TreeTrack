import { View, Text, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";
import EmptyGardens from "../layouts/EmptyGardens";
import FilledGardens from "../layouts/FilledGardens";
import database from '@react-native-firebase/database';
import { useEffect, useState } from "react";

const Gardens = ({ navigation }) => {
  const [gardens, setGardens] = useState([])
  useEffect(() => {
    database()
    .ref('/gardens/garden1')
    .on('value', snapshot => {
      console.log(snapshot.val());
      setGardens([snapshot.val()])
    });
  }, []);

  return (
    gardens.length == 0
      ? <EmptyGardens navigation={navigation} />
      : <FilledGardens navigation={navigation} gardens={gardens} />
  )
}

export default Gardens