import {Stack} from "expo-router"

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Đặt vé xem phim", // đổi chữ "index"
          headerStyle: { backgroundColor: "#6200EE" },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}