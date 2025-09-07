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
//                 <View style={styles.main}>
//                     <View style={styles.inputWrapper}>
//                         <Ionicons name="person" size={22} color="#000" style={styles.icon} />
//                         <TextInput
//                         style={styles.input}
//                         placeholder="Name"
//                         placeholderTextColor="#444"
//                         />
//                     </View>
//                     <View style={styles.inputWrapper}>
//                         <Ionicons name="lock-closed" size={22} color="#000" style={styles.icon} />
//                         <TextInput
//                         style={styles.input}
//                         placeholder="Password"
//                         placeholderTextColor="#444"
//                         secureTextEntry
//                         />
//                         <TouchableOpacity onPress={toggleShowPassword}>
//                             <Ionicons 
//                                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
//                                 size={24} 
//                                 color="#666" 
//                             />
//                         </TouchableOpacity>
//                     </View>

//                     <TouchableOpacity style={styles.button}>
//                         <Text style={styles.buttonText}>LOGIN</Text>
//                     </TouchableOpacity>

//                     <Text style={styles.subtitle}>
//                         CREATE ACCOUNT
//                     </Text>
//                     sad
//                 </View>
//             </View>
//         </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     main:{
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title:{
//         textAlign: 'left',
//         fontWeight: '900',
//         fontSize: 30,
//         color: 'black', 
//         marginBottom: 70,
//         marginLeft: 50,  
//     },
//     background: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor:'#d6b626ff'
//     },
//     inputWrapper: {
//         width: '90%',
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#FFD633",
//         paddingHorizontal: 10,
//         marginBottom: 15,
//         borderWidth: 1,
//         borderColor: 'rgba(255, 255, 255, 1)',
//     },
//     icon: {
//         marginRight: 8,
//     },
//     input: {
//         flex: 1,
//         height: 45,
//         fontSize: 16,
//         color: "#000",
//     },
//     button:{
//         backgroundColor: '#000000ff',
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
//         fontSize: 14,
//         fontWeight: '900',
//         color: '#333',
//         marginTop: 40,
//         marginBottom: 8,
//     }
// })