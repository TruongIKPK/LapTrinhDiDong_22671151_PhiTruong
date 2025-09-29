import { FlatList } from "react-native";
import ProductItem from "../component/ui/product-item";

function ProductList() {
    const products =[
        {"productImg": require("../assets/images/carbusbtops2 1.png"),},
        {"productImg": require("../assets/images/daucam 1.png"),},
        {"productImg": require("../assets/images/dauchuyendoi 1.png"),},
        {"productImg": require("../assets/images/dauchuyendoipsps2 1.png"),},
        {"productImg": require("../assets/images/daynguon 1.png"),},
        {"productImg": require("../assets/images/giacchuyen 1.png"),},
    ]
    return (
    //Hiển thị danh sách 2 cột
    <FlatList
        numColumns={2}
        data={products}
        renderItem={({ item }) => (
            <ProductItem
                productImg={item.productImg}
                productName="Product Name"
                price={100}
                ranking={4}
                numberOfReviews={10}
                promotion="10% off"
            />
        )}
    />
  )
}
export default ProductList;