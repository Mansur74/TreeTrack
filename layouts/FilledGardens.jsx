import { View, Text, Image, RefreshControl, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import { TouchableOpacity } from "react-native";
import GardenCard from "./GardenCard";
import { MenuProvider } from "react-native-popup-menu";
import { useState, useCallback } from "react";
import { getUserGardens } from "../services/garden_services";

const FilledGardens = ({ navigation, gardens, onUpdate }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [gardenList, setGardenList] = useState(gardens)
  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const data = await getUserGardens(true);
    setRefreshing(false);
    setGardenList(data);
  }, []);
  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF"]}
      style={{ height: "100%" }}
    >
      <View style={{ flex: 1 }}>

        <View style={{
          padding: 20,
          flex: 1,
        }}>
          <Text style={{ fontSize: 30, color: "white", fontWeight: "bold", color: "#9E673D" }}>
            my gardens
          </Text>

        </View>
        <View style={{
          flex: 17,
        }}>
          <LinearGradient
            colors={["#D1A96DE5", "#DB966FE5"]}
            style={{
              height: "100%",
              padding: 20,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50
            }}>

            <ScrollView
              style={{
                marginBottom: 100
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

              <MenuProvider>
                {
                  gardenList.map(garden =>
                    <GardenCard navigation={navigation} key={garden.id} garden={garden} onUpdate={onUpdate}/>
                  )
                }
              </MenuProvider>


            </ScrollView>

            <TouchableOpacity
              style={{ position: "absolute", backgroundColor: "#FFF1DD", padding: 20, borderRadius: 50, end: 10, bottom: 130 }}
              onPress={() => {
                navigation.navigate("CreateGarden", {onUpdate: onUpdate})
              }}
            >

              <Image
                source={require("../images/icons/plus.png")}
                resizeMode="stretch"
                style={{ height: 25, width: 25 }}
              >

              </Image>
            </TouchableOpacity>

          </LinearGradient>

        </View>

      </View>

    </LinearGradient>
  )
}

export default FilledGardens