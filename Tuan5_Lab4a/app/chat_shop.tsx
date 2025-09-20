import { FlatList, Text } from "react-native";
import { ChatProductItem } from "../component/ui/chat-product-item";
import { SafeAreaView } from "react-native-safe-area-context";

export function ChatShop() {
    const data = [
        { id: '1', productImg: require("../assets/images/ca_nau_lau.png"), productName: 'Sản phẩm 1', shopName: 'Shop A' },
        { id: '2', productImg: require("../assets/images/do_choi_dang_mo_hinh.png"), productName: 'Sản phẩm 2', shopName: 'Shop B' },
        { id: '3', productImg: require("../assets/images/ga_bo_toi.png"), productName: 'Sản phẩm 3', shopName: 'Shop C' },
    ];
    return (
       <SafeAreaView>
            <Text>Bạn có thắc mắc gì với sản phẩm vừa xem. Đừng ngại chat với shop</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ChatProductItem productImg={item.productImg} productName={item.productName} shopName={item.shopName} />}
                contentContainerStyle={{ padding: 16 }}
            />
       </SafeAreaView>
    )
}    

export default ChatShop;