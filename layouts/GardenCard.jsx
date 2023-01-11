import { Image, Text, TouchableOpacity, View } from "react-native"

const GardenCard = ({gardenName}) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center"
            }}
        >
            <View
                style={{
                    width: "75%",
                    backgroundColor: "#FFF1DD",
                    padding: 10,
                    borderRadius: 10
                }}>

                <Image
                    style={{
                        width: "100%",
                        marginBottom: 10
                    }}
                    source={require('../images/default_plant.png')}>

                </Image>

                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}>

                    <Text>
                        {gardenName}
                    </Text>

                    <TouchableOpacity>
                        <Image
                            style={{
                            }}
                            source={require('../images/icons/ic_options.png')}>

                        </Image>

                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default GardenCard