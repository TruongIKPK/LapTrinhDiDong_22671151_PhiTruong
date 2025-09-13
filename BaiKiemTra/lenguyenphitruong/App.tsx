import React, {useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ProductItem from './components/ProductItem'
const listProduct = [
  { id: '1', name: 'Sản phẩm A', price: 1000 },
  { id: '2', name: 'Sản phẩm B', price: 15000 },
  { id: '3', name: 'Sản phẩm C', price: 20000 },
  { id: '4', name: 'Sản phẩm D', price: 2500 },
];

const ShoppingCart = () => {
  const [cart, setCart] = useState([])

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const totalItems = cart.length;
  
  const themGioHang = ({item}) =>{
    setCart([...cart, item]);
  } 

  const renderItem = ({ item }) => (
    // <View style={styles.itemContainer}>
    //   <View>
    //     <Text style={styles.productName}>{item.name}</Text>
    //     <Text style={styles.productPrice}>{item.price.toLocaleString()} VNĐ</Text>
    //   </View>
    //   <TouchableOpacity style={styles.addButton} onPress={() => themGioHang({item})} >
    //     <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
    //   </TouchableOpacity>
    // </View>
    <ProductItem
      item={item}
      themGioHang={themGioHang}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sản phẩm</Text>
      <FlatList
        data={listProduct}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View> <Text>Số lượng: {totalItems}</Text> </View>
      <View> <Text>Tổng tiền: {totalPrice.toLocaleString()} VNĐ</Text> </View>
    </View>
  );
};

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

export default ShoppingCart;