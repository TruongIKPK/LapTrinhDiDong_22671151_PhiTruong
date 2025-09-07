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
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.background}>
                 <Image source={require('../assets/images/image.png')}
                    resizeMode="contain"
                />
                <View style={styles.inputContainer1}>
                    <Ionicons name="person" size={22} color="#000" style={styles.icon} />
                    <TextInput 
                        placeholder="Please input user name"
                        placeholderTextColor="#999"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={22} color="#000" style={styles.icon} />
                    <TextInput
                        placeholder="Please input password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                    />
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>

                <View style={styles.other}>
                    <Text>
                        Register
                    </Text>
                    <Text>Forgot password</Text>
                </View>

                <Text style={styles.or}>Or login with</Text>

                <View style={styles.socialRow}>
                    {/* Facebook */}
                    <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
                    <Ionicons name="logo-facebook" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* Zalo (dùng chữ Z vì Ionicons chưa có logo Zalo) */}
                    <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#0066ff' }]}>
                    <Text style={styles.socialText}>Z</Text>
                    </TouchableOpacity>

                    {/* Google */}
                    <TouchableOpacity style={[styles.socialButton, { borderWidth: 1, borderColor: '#ccc' }]}>
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title:{
          textAlign: 'center',
        fontWeight: '600',
        fontSize: 30,
        color: 'black', 
        marginBottom: 70,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#ffffffff'
    },
    inputContainer1:{
        borderBottomWidth: 1,
        borderBottomColor: "rgba(125, 125, 125, 1)",
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15
    },
    inputContainer:{
        borderBottomWidth: 1,
        borderBottomColor: "rgba(125, 125, 125, 1)",
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15
    },
    button:{
        backgroundColor: '#386ffc',
        fontWeight: "700",
        width: '80%',
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 10,
        marginTop: 20
    },
    buttonText:{
        color: '#fff', 
        textAlign: 'center'
    },
    subtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 40,
    marginBottom: 8,
  },
  other:{
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBlockStart: 20,
    marginBlockEnd: 50
  },
  or: {
    fontSize: 14,
    marginBottom: 30,
    color: '#444',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
})