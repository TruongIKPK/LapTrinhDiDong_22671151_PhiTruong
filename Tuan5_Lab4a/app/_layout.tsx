import { Stack } from "expo-router";
import { TouchableOpacity, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
      name="chat_shop"
      options={{
        title: " Chat",
        headerStyle: {
        backgroundColor: "#1BA9FF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
        fontWeight: "bold",
        },
        headerLeft: () => (
        <SafeAreaView>
          <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        </SafeAreaView>
        ),
        headerRight: () => (
        <TouchableOpacity
          onPress={() => {
          }}
          style={{ 
          marginRight: 15,
          flexDirection: 'row',
          alignItems: 'center',
          }}
        >
          <Ionicons name="cart-outline" size={24} color="white" />
          <Text style={{ 
          color: 'white', 
          fontSize: 12, 
          marginLeft: 5,
          backgroundColor: 'red',
          borderRadius: 10,
          paddingHorizontal: 6,
          paddingVertical: 2,
          minWidth: 18,
          textAlign: 'center'
          }}>
          3
          </Text>
        </TouchableOpacity>
        ),
      }}
      />
      <Stack.Screen
      name="product-list"
      options={{
        title: "",
        headerStyle: {
        backgroundColor: "#1BA9FF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
        fontWeight: "bold",
        },
        headerLeft: () => (
        <SafeAreaView style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
          backgroundColor: 'white',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginHorizontal: 10,
          }}
          placeholder="Tìm kiếm sản phẩm..."
        />
        </SafeAreaView>
        ),
        headerRight: () => (
        <TouchableOpacity
          onPress={() => {
          }}
          style={{ 
          marginRight: 15,
          flexDirection: 'row',
          alignItems: 'center',
          }}
        >
          <Ionicons name="cart-outline" size={24} color="white" />
          <Text style={{ 
          color: 'white', 
          fontSize: 12, 
          marginLeft: 5,
          backgroundColor: 'red',
          borderRadius: 10,
          paddingHorizontal: 6,
          paddingVertical: 2,
          minWidth: 18,
          textAlign: 'center'
          }}>
          3
          </Text>
        </TouchableOpacity>
        ),
      }}
      />
      <Stack.Screen name="user-list" options={
        { title: "Danh sách người dùng", 
           headerLeft: () => (
            <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginLeft: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#030303ff" />
          </TouchableOpacity>
        ),
    }}
    />
    </Stack>
  );
}
