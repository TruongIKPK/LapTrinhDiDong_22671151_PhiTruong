import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

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
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
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
    </Stack>
  );
}
