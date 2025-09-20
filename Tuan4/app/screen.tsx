import React, {useState} from "react"
import { View, Text, TouchableOpacity,  StyleSheet, ScrollView} from "react-native"
import Chair_UI from "@/components/ui/Chair_UI"
import MovieInfo from "@/components/ui/MovieInfo";

const Screen = () =>{
    const [selected, setSelected] = useState<number[]>([]);

    const toggleChair = (num: number) => {
        if(selected.includes(num)){
            setSelected(selected.filter((n) => n!==num));
    
        }else{
            setSelected([...selected, num]);
        }
    }

    return(
        <View style={styles.container}>

            <View style={styles.row}>
                <MovieInfo
                    title="Avengers: Endgame"
                    time="19:30 - 21:45"
                    cinema="CGV Hùng Vương Plaza"
                    room="2"
                    posterUrl="https://vimages.coccoc.com/vimage?ns=cinema&url=https%3A%2F%2Figuov8nhvyobj.vcdn.cloud%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2F1%2Fimage%2Fc5f0a1eff4c394a251036189ccddaacd%2F3%2F5%2F350x495-muado_1.jpg"
                />
                
                <TouchableOpacity style={styles.button} onPress={() => alert("Đặt vé thành công!")}>
                    <Text style={styles.buttonText}>Đặt vé xác nhận</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Đặt vé xem phim</Text>

            <View style={styles.screenView}>
                <Text style={styles.screenText}>Màn hình</Text>
            </View>

            <ScrollView contentContainerStyle={styles.seatContainer}>
                {Array.from({length: 20}, (_, i)=>(
                    <Chair_UI
                        key={i+1}
                        number={i+1}
                        selected={selected.includes(i+1)}
                        onPress={()=>toggleChair(i+1)}
                    />
                ))}
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    row: {
        flexDirection: "row", 
        alignItems: "center",
        gap: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    screenView: {
        height: 40,
        backgroundColor: "#999",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginBottom: 20,
    },
    screenText: {
        fontWeight: "bold",
        color: "#fff",
    },
    seatContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    button: {
    backgroundColor: "#ef4444", 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, 
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default Screen;