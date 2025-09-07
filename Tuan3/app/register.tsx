import React, {useState} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
export default function login(){
    const [selected, setSelected] = useState(null); 
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.background}>
                <Text style={styles.title}>REGISTER</Text>
                <TextInput
                    style={styles.inputContainer}
                    placeholder="Name"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                />
                <TextInput
                    style={styles.inputContainer}
                    placeholder="Phone"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                />
                <TextInput
                    style={styles.inputContainer}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                />
                <View style={styles.inputContainer}>>
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={toggleShowPassword}>
                        <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
                            size={24} 
                            color="#666" 
                        />
                    </TouchableOpacity> 
                </View>
                <TextInput
                        style={styles.inputContainer}
                        placeholder="Birthday"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                    />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>REGISTER</Text>
                </TouchableOpacity>

                <View style={styles.selec}>
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setSelected('male')}
                    >
                        <Ionicons
                        name={selected === 'male' ? 'radio-button-on' : 'radio-button-off'}
                        size={22}
                        color="black"
                        />
                        <Text style={styles.label}>Male</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setSelected('female')}
                    >
                        <Ionicons
                        name={selected === 'female' ? 'radio-button-on' : 'radio-button-off'}
                        size={22}
                        color="black"
                        />
                        <Text style={styles.label}>Female</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>
                    When you agree to terms and conditions
                </Text>
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
        backgroundColor:'#d8efdf'
    },
        title:{
          textAlign: 'center',
        fontWeight: '600',
        fontSize: 30,
        color: 'black', 
        marginBottom: 40,
    },
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#cae1d1',
        width: '90%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 15,
    },
    selec:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        marginRight: 20
    },
    label: {
        marginLeft: 6,
        fontSize: 16,
        color: '#000',
    },
    button:{
        backgroundColor: '#c34e3b',
        fontWeight: "700",
        width: '80%',
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText:{
        color: '#fff', 
        textAlign: 'center'
    },
})