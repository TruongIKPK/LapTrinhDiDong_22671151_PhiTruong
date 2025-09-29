import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';

export default function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cửa hàng điện thoại</Text>
        
        <View style={styles.productContainer}>
          <Image 
            source={require('../../assets/images/vs_blue.png')}
            style={styles.productImage}
          />
          <Text style={styles.productName}>Điện Thoại Vsmart Joy 3</Text>
          <Text style={styles.productPrice}>1.790.000 đ</Text>
          
          {/* <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/detail-product')}
          >
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.colorButton]}
            onPress={() => router.push('/select-color')}
          >
            <Text style={styles.buttonText}>Chọn màu sắc</Text>
          </TouchableOpacity> */}

            <Pressable onPress={() => navigation.navigate('detail-product')} style={styles.button}>
              Click
            </Pressable>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  productContainer: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  colorButton: {
    backgroundColor: '#FF6B35',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
