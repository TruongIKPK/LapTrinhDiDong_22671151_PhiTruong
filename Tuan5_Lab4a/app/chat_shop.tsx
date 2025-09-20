import { FlatList, Text, StyleSheet, View } from "react-native";
import { ChatProductItem } from "../component/ui/chat-product-item";
import { SafeAreaView } from "react-native-safe-area-context";

export function ChatShop() {
    const data = [
        { id: '1', productImg: require("../assets/images/ca_nau_lau.png"), productName: 'Ca nấu lẩu', shopName: 'Devang' },
        { id: '2', productImg: require("../assets/images/do_choi_dang_mo_hinh.png"), productName: 'Đồ chơi dạng mô hình', shopName: 'Thế giới đồ chơi' },
        { id: '3', productImg: require("../assets/images/ga_bo_toi.png"), productName: 'Gà bơ tỏi', shopName: 'LTD Food' },
        { id: '4', productImg: require("../assets/images/hieu_long_con_tre.png"), productName: 'Hiểu lòng con trẻ', shopName: 'Minh Long Book' },
        { id: '5', productImg: require("../assets/images/lanh_dao_gian_don.png"), productName: 'Lãnh đạo giản đơn', shopName: 'Minh Long Book' },
        { id: '6', productImg: require("../assets/images/xa_can_cau.png"), productName: 'Xả cần câu', shopName: 'Thế giới câu cá' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Bạn có thắc mắc với sản phẩm vừa xem. Đừng ngại chat với shop!
                </Text>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatProductItem 
                        productImg={item.productImg} 
                        productName={item.productName} 
                        shopName={item.shopName} 
                    />
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#b0b0b0ff',
        padding: 16,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    listContainer: {
        padding: 16,
    },
});

export default ChatShop;