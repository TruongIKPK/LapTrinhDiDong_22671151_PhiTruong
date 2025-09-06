import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';

export default function Welcome() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content'/>
                <View style={styles.background}>
                    <View style={styles.content}>
                        <Image source={require('../assets/images/ellipse.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>GROW</Text>
                        <Text style={styles.title}>YOUR BUSINESS</Text>
                        <Text style={styles.subtitle}>
                            We will help you to grow your business using online server
                        </Text>
                         <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>LOGIN</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>SIGN UP</Text>
                            </TouchableOpacity>
                         </View>
                    </View>
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
        backgroundColor: '#68b3feff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    image:{
        marginBottom: 70
    },
    title: {
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 30
    },
        subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 40,
        lineHeight: 22,
        fontWeight: '500',
    },
    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 30,
    },
    button:{
        backgroundColor: 'rgba(252, 252, 68, 0.8)',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15
    },
    buttonText:{
        fontWeight: '800',
    },
});