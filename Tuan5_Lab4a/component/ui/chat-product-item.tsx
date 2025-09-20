import { SafeAreaView } from "react-native-safe-area-context"
import React from "react"
import { View, Image, Text, TouchableOpacity } from "react-native"

interface ChatProductItemProps {
    productImg: any,
    productName: string,
    shopName: string,
}

export const ChatProductItem: React.FC<ChatProductItemProps> = ({ productImg, productName, shopName }) => {
    return (
        <SafeAreaView>
            <View>
                {/* Hình ảnh lấy từ asset */}
                <Image source={productImg} />
                <View>
                    <Text>{productName}</Text>
                    <Text>{shopName}</Text>
                </View>
                <TouchableOpacity>
                    <Text>Chat</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}