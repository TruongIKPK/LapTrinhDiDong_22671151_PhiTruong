import React, { useState } from "react";
import { View, Image, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';

interface ProductProps {
    imgUrl?: string,
    product_name?: string,
    number_color?: number,
}

const SelectColor: React.FC<ProductProps> = ({
    imgUrl = "vs_blue.png",
    product_name = "Điện Thoại Vsmart Joy 3 Hàng chính hãng",
    number_color = 4
}) => {
    const [selectedColor, setSelectedColor] = useState<number>(0);
    
    const colorData = [
        { color: '#C5F1FB', name: 'Xanh nhạt', image: 'vs_blue.png' },
        { color: '#F30D0D', name: 'Đỏ', image: 'vs_red.png' },
        { color: '#000000', name: 'Đen', image: 'vs_black.png' },
        { color: '#234896', name: 'Xanh đậm', image: 'vs_blue.png' },
    ];

    const getImageSource = (imageName: string) => {
        switch(imageName) {
            case "vs_blue.png":
                return require("../assets/images/vs_blue.png");
            case "vs_red.png":
                return require("../assets/images/vs_red.png");
            case "vs_black.png":
                return require("../assets/images/vs_black.png");
            case "vs_silver.png":
                return require("../assets/images/vs_silver.png");
            default:
                return require("../assets/images/vs_blue.png");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.productInfo}>
                <Image
                    source={getImageSource(colorData[selectedColor]?.image || imgUrl)}
                    style={styles.productImage}
                />
                <Text style={styles.productName}>{product_name}</Text>
            </View>
            <View style={styles.colorSection}>
                <Text style={styles.colorTitle}>Chọn một màu bên dưới:</Text>
                <FlatList
                    data={colorData.slice(0, number_color)}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({item, index}) => (
                        <TouchableOpacity
                            style={[
                                styles.colorItem,
                                { backgroundColor: item.color },
                                selectedColor === index && styles.selectedColor
                            ]}
                            onPress={() => setSelectedColor(index)}
                        >
                        </TouchableOpacity>
                    )}
                    numColumns={2}
                    contentContainerStyle={styles.colorList}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.doneButton}
                    onPress={() => {
                        const selectedColorData = colorData[selectedColor];
                        router.push({
                            pathname: '/(tabs)',
                            params: { 
                                selectedColor: selectedColorData.image,
                                colorName: selectedColorData.name 
                            }
                        });
                    }}
                >
                    <Text style={styles.doneButtonText}>XONG</Text>
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
    productInfo: {
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    productImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 16,
    },
    productName: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    colorSection: {
        flex: 1,
        padding: 16,
    },
    colorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    colorList: {
        alignItems: 'center',
    },
    colorItem: {
        width: 80,
        height: 80,
        margin: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#007AFF',
        borderWidth: 3,
    },
    buttonContainer: {
        padding: 16,
    },
    doneButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    doneButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default SelectColor;