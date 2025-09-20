import { FlatList } from "react-native";
import ProductItem from "../component/ui/product-item";

function ProductList() {
    const products =[
        {"productImg": require("../assets/images/vs_blue.png"),},
        {"productImg": require("../assets/images/vs_red.png"),},
        {"productImg": require("../assets/images/vs_green.png"),},
        {"productImg": require("../assets/images/vs_yellow.png"),},
    ]
    return (
    <FlatList
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