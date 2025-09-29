import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { View, Image, Text, FlatList, StyleSheet } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
interface ProductItemProps {
    productImg: any,
    productName: string,
    price: number,
    ranking: number,
    numberOfReviews: number,
    promotion?: string,
}

const ProductItem: React.FC<ProductItemProps> = ({productImg, productName, price, ranking, numberOfReviews, promotion}) => {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Image source={productImg} style={styles.productImage} />
                <Text style={styles.productName}>{productName}</Text>
                <View style={styles.ratingContainer}>
                    <FlatList
                        data={Array.from({length: ranking})}
                        renderItem={()=> <MaterialIcons name="star" size={18} color="#FFD700" />}
                        horizontal
                        scrollEnabled={false}
                    />
                    <Text>({numberOfReviews})</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{price} đ</Text>
                    <Text>{promotion}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    productImage: {
        width: 200,
        height: 100,
    },
    productName: {
        fontSize: 16,
        marginTop: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontWeight: 'bold',
    }
});
export default ProductItem;
