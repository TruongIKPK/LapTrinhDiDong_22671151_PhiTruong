import React from 'react';
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
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content'/>
            <LinearGradient
                colors={['#daf1f1ff', '#63c4edff']} 
                locations={[0.8, 1]} 
                style={styles.gradient}
            />
            <View style={styles.background}>
                <Image source={require('../assets/images/Group.png')}
                    resizeMode="contain"
                />
                <Text style={styles.title}>FORGET</Text>
                <Text style={styles.title}>PASSWORD</Text>
                <Text style={styles.subtitle}>Provide your account’s email for which you want to reset your password</Text>
                 <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                    <TextInput style={styles.input}>Email</TextInput>
                 </View>
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>NEXT</Text>
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
        fontSize: 30,
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
    }
});