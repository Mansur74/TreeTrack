import { StyleSheet } from "react-native";

const styles = StyleSheet.create(
    {
        container: {
            padding: 20,
            flex: 1
        },
        bottomNavigation: {
            position: "absolute",
            height: 60,
            margin: 20,
            borderRadius: 30,
            paddingLeft: 20,
            paddingRight: 25
        },

        bottomNavigationİcons:{
            width: 30,
            height: 30
        },

        text: { 
            fontSize: 30, 
            fontWeight: "bold", 
            color: "#FFF1DD",
            marginBottom: 20
        },

        t4: { 
            fontSize: 17, 
            color: "white",
            marginBottom: 20
        },
        button: 
        {
            width: 250,
            paddingTop: 10,
            paddingBottom: 10,
            paddingRight: 20,
            paddingLeft: 20,
            borderRadius: 50,
            marginBottom: 20,
            backgroundColor: "#44A77A",
            fontWeight: "bold"
        }, 
        bt1: {
            color: "white",
            textAlign: "center"
        }

    }
)

export default styles;