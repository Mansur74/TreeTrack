import { View, Text, Image, ToastAndroid } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";
import EmptyGardens from "../layouts/EmptyGardens";
import FilledGardens from "../layouts/FilledGardens";
import { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';

// get gardens
const getGardens = async () => {
  gList = []
  await firestore()
    .collection("gardens")
    .get()
    .then(querySnapshot => {
      gList = querySnapshot.docs.map(doc => doc.data())
    })
    .catch((error) => {
      console.error(error);
    });
  return gList
}

const Gardens = ({ navigation }) => {
  const [gardens, setGardens] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setGardens(await getGardens());
    };
    fetchData();
  }, []);

  return (
    gardens.length == 0
      ? <EmptyGardens navigation={navigation} />
      : <FilledGardens navigation={navigation} gardens={gardens}/>
  )
}

export default Gardens