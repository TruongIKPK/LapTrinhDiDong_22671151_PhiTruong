// import React, { useEffect, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TouchableOpacity, 
//   SafeAreaView,
//   StatusBar,
//   Image,
//   Animated,
//   Easing
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// export default function FirstScreen() {
//     //Độ mờ
//     const fadeAnim = useRef(new Animated.Value(0)).current;
//     //Tỉ lệ phóng to
//     const scaleAnim = useRef(new Animated.Value(0.8)).current;
//     //Vị trí
//     const slideUpAnim = useRef(new Animated.Value(50)).current;
//     //Màu nền animation
//     const gradientAnim = useRef(new Animated.Value(0)).current;    

//     useEffect(() => {
//         Animated.parallel([
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 1000,
//                 useNativeDriver: true,
//                 easing: Easing.out(Easing.ease)
//             }),
//             Animated.timing(scaleAnim, {
//                 toValue: 1,
//                 duration: 800,
//                 useNativeDriver: true,
//                 easing: Easing.out(Easing.back(1.2))
//             }),
//             Animated.timing(slideUpAnim, {
//                 toValue: 0,
//                 duration: 1200,
//                 useNativeDriver: true,
//                 easing: Easing.out(Easing.ease)
//             }),
//             Animated.timing(gradientAnim, {
//                 toValue: 1,
//                 duration: 5000,
//                 useNativeDriver: false,
//                 easing: Easing.out(Easing.ease)
//             })
//         ]).start();
//     }, []);

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle='light-content'/>
            
 
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: '#63c4edff' }]} />
   
//             <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientAnim }]}>
//                 <LinearGradient
//                     colors={['#daf1f1ff', '#63c4edff']} 
//                     locations={[0.8, 1]} 
//                     style={StyleSheet.absoluteFill}
//                 />
//             </Animated.View>

//             <View style={styles.background}>
//                 <View style={styles.content}>
//                     <Animated.View style={[
//                         styles.imageContainer,
//                         {
//                             opacity: fadeAnim,
//                             transform: [{scale: scaleAnim}]
//                         }
//                     ]}>
//                         <Image source={require('../assets/images/ellipse.png')}
//                             style={styles.image}
//                             resizeMode="contain"
//                         />
//                     </Animated.View>

//                     <Animated.View style={{
//                         opacity: fadeAnim,
//                         transform: [{ translateY: slideUpAnim }]
//                     }}>
//                         <Text style={styles.title}>GROW</Text>
//                         <Text style={styles.title}>YOUR BUSINESS</Text>
//                     </Animated.View>

//                     <Animated.View style={{
//                         opacity: fadeAnim,
//                         transform: [{ translateY: slideUpAnim }]
//                     }}>
//                         <Text style={styles.subtitle}>
//                             We will help you to grow your business using online server
//                         </Text> 
//                     </Animated.View>
                    
//                     <Animated.View style={{
//                         opacity: fadeAnim,
//                         transform: [{ translateY: slideUpAnim }]
//                     }}>
//                         <View style={styles.buttonContainer}>
//                             <TouchableOpacity style={styles.button}>
//                                 <Text style={styles.buttonText}>LOGIN</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.button}>
//                                 <Text style={styles.buttonText}>SIGN UP</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </Animated.View>
//                 </View>
//             </View>
//             <Animated.View style={{
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideUpAnim }]
//             }}>
//                 <View style={styles.footer}>
//                     <Text style={styles.footer_txt}>HOW WE WORK</Text>
//                 </View>
//             </Animated.View>
//         </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     background: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     content: {
//         alignItems: 'center',
//         paddingHorizontal: 30,
//     },
//     imageContainer: {
//         marginBottom: 30,
//     },
//     image: {
//         width: 140,
//         height: 140,
//         marginBottom: 20,

//     },
//     title: {
//         textAlign: 'center',
//         fontWeight: '800',
//         fontSize: 30,
//         marginBottom: 5,
//         textShadowColor: 'rgba(0, 0, 0, 0.5)',
//         textShadowOffset: { width: 1, height: 1 },
//         textShadowRadius: 3,
//     },
//     subtitle: {
//         fontSize: 16,
//         textAlign: 'center',
//         marginVertical: 40,
//         lineHeight: 22,
//         fontWeight: '500',
//         textShadowColor: 'rgba(0, 0, 0, 0.5)',
//         textShadowOffset: { width: 0.5, height: 0.5 },
//         textShadowRadius: 2,
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//         marginTop: 30,
//         gap: 20,
//     },
//     button: {
//         backgroundColor: 'rgba(252, 252, 68, 0.9)',
//         paddingVertical: 15,
//         paddingHorizontal: 25,
//         borderRadius: 15,
//         flex: 1,
//         alignItems: 'center',
//         shadowColor: "#000",
//         shadowRadius: 4.65,
//         elevation: 8,
//     },
//     buttonText: {
//         fontWeight: '800',
//         color: 'black',
//         fontSize: 16,
//     },
//     footer:{
//         alignItems: 'center',
//         marginBottom: 80,
//         fontWeight: '900'
//     },
//     footer_txt:{
//         fontSize: 18, 
//         fontWeight: '700'
//     }
// });