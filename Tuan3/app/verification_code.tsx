import React, {useState} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Forget_Password() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content'/>
            <LinearGradient
                colors={['#daf1f1ff', '#63c4edff']} 
                locations={[0.8, 1]} 
                style={styles.gradient}
            />
            <View style={styles.background}>
                <Text style={styles.title}>CODE</Text>
                <Text style={styles.title1}>VERIFICATION</Text>
                <Text style={styles.subtitle}>Enter ontime password sent on
                ++849092605798</Text>
                <View style={styles.codeContainer}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={[styles.codeInput, digit !== '' && styles.codeInputFilled]}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>VERIFY CODE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 60,
        color: 'black', 
        marginBottom: 5,
    },
    title1:{
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 16,
        color: 'black', 
        marginBottom: 5,
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
     inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c7c6c6ff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        width: '80%',
        marginBottom: 30,
        shadowColor: "#000",
    },
    inputIcon: {
        marginRight: 14,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
     button: {
        backgroundColor: 'rgba(252, 252, 68, 0.9)',
        width:'80%',
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText:{
        fontSize: 16,
        fontWeight: 900
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 40,
    },
    codeInput: {
        width: 50,
        height: 60,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: 'white',
    },
    codeInputFilled: {
        borderColor: '#63c4edff',
        backgroundColor: '#f0f9ff',
    },
});