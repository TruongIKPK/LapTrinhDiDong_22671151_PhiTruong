import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Forget_Password(){
    return(
        <SafeAreaView>
             <LinearGradient
                    colors={['#daf1f1ff', '#63c4edff']} 
                    locations={[0.8, 1]} 
                    style={StyleSheet.absoluteFill}
            />
            <View style={styles.background}>
                <Text>Hello</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    imageContainer: {
        marginBottom: 30,
    },
    image: {
        width: 140,
        height: 140,
        marginBottom: 20,

    },
    title: {
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 30,
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 40,
        lineHeight: 22,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0.5, height: 0.5 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 30,
        gap: 20,
    },
    button: {
        backgroundColor: 'rgba(252, 252, 68, 0.9)',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 15,
        flex: 1,
        alignItems: 'center',
        shadowColor: "#000",
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        fontWeight: '800',
        color: 'black',
        fontSize: 16,
    },
    footer:{
        alignItems: 'center',
        marginBottom: 80,
        fontWeight: '900'
    },
    footer_txt:{
        fontSize: 18, 
        fontWeight: '700'
    }
});