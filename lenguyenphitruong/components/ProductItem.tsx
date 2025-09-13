import React, {useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ProductItem = ({item, themGioHang}) => {
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price.toLocaleString()} VNĐ</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => themGioHang({item})} >
          <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  productName: {
    fontSize: 18,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductItem