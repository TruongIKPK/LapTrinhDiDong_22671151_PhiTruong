// import React, {useState} from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TouchableOpacity, 
//   SafeAreaView,
//   StatusBar,
//   Image,
//   TextInput,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// export default function login(){
//     const [showPassword, setShowPassword] = useState(false);
//     const toggleShowPassword = () => {
//         setShowPassword(!showPassword);
//     };
//     return(
//         <SafeAreaView style={styles.container}>
//             <View style={styles.background}>
//                 <Text style={styles.title}>Login</Text>
//                 <TextInput style={styles.email} 
//                     placeholder="Email"
//                     placeholderTextColor="#999"
//                 />
//                 <View style={styles.inputContainer}>
//                     <TextInput
//                         placeholder="Password"
//                         placeholderTextColor="#999"
//                         secureTextEntry={!showPassword}
//                     />
//                     <TouchableOpacity onPress={toggleShowPassword}>
//                         <Ionicons 
//                             name={showPassword ? "eye-outline" : "eye-off-outline"} 
//                             size={24} 
//                             color="#666" 
//                         />
//                     </TouchableOpacity>
//                 </View>
//                 <TouchableOpacity style={styles.button}>
//                     <Text style={styles.buttonText}>LOGIN</Text>
//                 </TouchableOpacity>

//                 <Text style={styles.subtitle}>
//                     When you agree to terms and conditions
//                 </Text>

//                 <TouchableOpacity>
//                     <Text style={styles.link}>Forgot your password?</Text>
//                 </TouchableOpacity>

//                 <Text style={styles.or}>Or login with</Text>

//                 <View style={styles.socialRow}>
//                     {/* Facebook */}
//                     <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
//                     <Ionicons name="logo-facebook" size={24} color="#fff" />
//                     </TouchableOpacity>

//                     {/* Zalo (dùng chữ Z vì Ionicons chưa có logo Zalo) */}
//                     <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#0066ff' }]}>
//                     <Text style={styles.socialText}>Z</Text>
//                     </TouchableOpacity>

//                     {/* Google */}
//                     <TouchableOpacity style={[styles.socialButton, { borderWidth: 1, borderColor: '#ccc' }]}>
//                     <Ionicons name="logo-google" size={24} color="#DB4437" />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     title:{
//           textAlign: 'center',
//         fontWeight: '600',
//         fontSize: 30,
//         color: 'black', 
//         marginBottom: 70,
//     },
//     background: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor:'#d8efdf'
//     },
//     email:{
//         backgroundColor: '#cae1d1',
//         width: '90%',
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 15,
//         marginBottom: 20
//     },
//     inputContainer:{
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: '#cae1d1',
//         width: '90%',
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 15,
//         paddingRight: 15
//     },
//     button:{
//         backgroundColor: '#c34e3b',
//         fontWeight: "700",
//         width: '80%',
//         paddingTop: 15,
//         paddingBottom: 15,
//         marginTop: 20
//     },
//     buttonText:{
//         color: '#fff', 
//         textAlign: 'center'
//     },
//     subtitle: {
//     fontSize: 14,
//     color: '#333',
//     marginTop: 40,
//     marginBottom: 8,
//   },
//   link: {
//     fontSize: 14,
//     color: 'blue',
//     textDecorationLine: 'underline',
//     marginBottom: 15,
//   },
//   or: {
//     fontSize: 14,
//     marginBottom: 30,
//     color: '#444',
//   },
//   socialRow: {
//     flexDirection: 'row',
//     gap: 15,
//   },
//   socialButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   socialText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   }
// })