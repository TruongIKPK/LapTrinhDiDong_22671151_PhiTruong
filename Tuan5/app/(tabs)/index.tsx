import React from "react";
import { View, Image, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';

interface ProductProps {
    imgUrl?: string,
    product_name?: string,
    rank?: number,
    number_comment?: number,
    price?: number,
    price_origin?: number,
    number_color?: number,
}

const DetailProduct: React.FC<ProductProps> = ({
    imgUrl = "vs_blue.png", 
    product_name = "Điện Thoại Vsmart Joy 3 - Hàng chính hãng", 
    rank = 5, 
    number_comment = 828, 
    price = 1790000, 
    price_origin = 1990000, 
    number_color = 4
}) => {
    const params = useLocalSearchParams();
    const currentImage = params.selectedColor as string || imgUrl;

    console.log('All params:', params);
    console.log('Current image:', currentImage);
    console.log('Color name:', params.colorName);

    const getImageSource = (imageName: string) => {
        switch(imageName) {
            case "vs_blue.png":
                return require("../../assets/images/vs_blue.png");
            case "vs_red.png":
                return require("../../assets/images/vs_red.png");
            case "vs_black.png":
                return require("../../assets/images/vs_black.png");
            case "vs_silver.png":
                return require("../../assets/images/vs_silver.png");
            default:
                return require("../../assets/images/vs_blue.png");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image 
                    source={getImageSource(currentImage)}
                    style={styles.productImage}
                />
                <Text style={styles.productName}>{product_name}</Text>
                <View style={styles.ratingContainer}>
                   <FlatList 
                        data={Array.from({length: rank})}
                        keyExtractor={(_, index)=> index.toString()}
                        renderItem={()=> <MaterialIcons name="star" size={18} color="#FFD700" />}
                        horizontal
                        scrollEnabled={false}
                        style={styles.starList}
                   />
                   <Text style={styles.commentText}>Xem {number_comment} đánh giá</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{price?.toLocaleString()} đ</Text>
                    <Text style={styles.originalPrice}>{price_origin?.toLocaleString()} đ</Text>
                </View>
                <View style={styles.guaranteeContainer}>
                    <Text style={styles.guaranteeText}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
                </View>
                <TouchableOpacity 
                    style={styles.colorButton}
                    onPress={() => router.push('/select-color')}
                >
                    <Text style={styles.colorButtonText}>
                        {number_color} MÀU - CHỌN MÀU
                        {params.colorName && ` (${params.colorName})`}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>CHỌN MUA</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    productImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginBottom: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    starList: {
        marginRight: 8,
    },
    commentText: {
        fontSize: 14,
        color: '#666',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginRight: 16,
    },
    originalPrice: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: '#666',
    },
    guaranteeContainer: {
        marginBottom: 16,
    },
    guaranteeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'red',
    },
    colorButton: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    colorButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: 'red',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default DetailProduct;