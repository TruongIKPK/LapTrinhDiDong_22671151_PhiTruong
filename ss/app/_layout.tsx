import React from 'react';
import DetailProduct from './detail-product';
import SelectColor from './select-color';

export default function RootLayout() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
        <Stack.Screen name="detail-product" component={DetailProduct}/>
        <Stack.Screen name="select-color" component={SelectColor}/>
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}
