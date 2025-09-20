import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';

interface ChatProductItemProps {
    productImg: ImageSourcePropType;
    productName: string;
    shopName: string;
}

export function ChatProductItem({ productImg, productName, shopName }: ChatProductItemProps) {
    return (
        <View style={styles.container}>
            <Image source={productImg} style={styles.productImage} />
            <View style={styles.textContainer}>
                <Text style={styles.productName} numberOfLines={2}>
                    {productName}
                </Text>
                <Text style={styles.shopName}>
                    Shop: {shopName}
                </Text>
            </View>
            <TouchableOpacity style={styles.chatButton}>
                <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    shopName: {
        fontSize: 12,
        color: '#E53E3E',
        fontWeight: '500',
    },
    chatButton: {
        backgroundColor: '#E53E3E',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        minWidth: 60,
        alignItems: 'center',
    },
    chatButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});