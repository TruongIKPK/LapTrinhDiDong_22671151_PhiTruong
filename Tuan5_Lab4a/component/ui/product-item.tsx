import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { View, Image, Text, FlatList } from "react-native";
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
            <View>
                <Image source={productImg} style={{width: 100, height: 100}} />
                <Text>{productName}</Text>
                <View>
                    <FlatList 
                        data={Array.from({length: ranking})}
                        renderItem={()=> <MaterialIcons name="star" size={18} color="#FFD700" />}
                        horizontal
                        scrollEnabled={false}
                    />
                    <Text>({numberOfReviews})</Text>
                </View>
                <View>
                    <Text>{price} đ</Text>
                    <Text>{promotion}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProductItem;
