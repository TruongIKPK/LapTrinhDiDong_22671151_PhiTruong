
import { Stack } from 'expo-router/stack';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail-product" options={{ title: 'Chi tiết sản phẩm' }} />
      <Stack.Screen name="select-color" options={{ title: 'Chọn màu sắc' }} />
    </Stack>
  );
}
