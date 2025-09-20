import React from "react"
import {TouchableOpacity, Text, StyleSheet} from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type ChairProps = {
    number: number;
    selected?: boolean;
    onPress?: ()=>void;
}

const Chair_UI: React.FC<ChairProps> = ({number, selected, onPress}) => {
    return (
        <TouchableOpacity
            style={[styles.chair, selected && styles.chairSelected]}
            onPress={onPress}
        >
            <MaterialIcons
                name="event-seat"
                size={24}
                color={selected ? "#ffffffff" : "#ffffffff"}
            />
            <Text style={[styles.text, selected && styles.textSelected]}>{number}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    chair:{
        width: 60,
        height: 60,
        backgroundColor: "#4CAF50",
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    chairSelected:{
        backgroundColor: "#dad738ff",
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 4,
        color: "#333",
    },
    textSelected:{
        color: "#fff",
    },
})

export default Chair_UI;