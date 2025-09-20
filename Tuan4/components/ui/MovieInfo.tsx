import React from "react"
import {View, Text, StyleSheet, Image} from "react-native"

type MovieInfoProps = {
    title: string,
    time: string,
    cinema: string,
    room: string,
    posterUrl?: string;
}

const MovieInfo: React.FC<MovieInfoProps> = ({
    title, time, cinema, room, posterUrl,
}) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Image
                    source={{uri: posterUrl}}
                    style={styles.poster}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.detail}>Thời gian: {time}</Text>
                    <Text style={styles.detail}>Rạp: {cinema}</Text>
                    <Text style={styles.detail}>Phòng chiếu: {room}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#f2f2f2", 
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#fff",
    },
    poster: {
        width: 80,
        height: 120,
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
    detail: {
        fontSize: 14,
        color: "#555",
        marginBottom: 2,
    },
});

export default MovieInfo;