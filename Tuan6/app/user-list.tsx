import { FlatList, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function UserList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const [styleView, setStyleView] = useState('horizontal');

    useEffect(() => {
        fetch('https://68305f54f504aa3c70f78f4d.mockapi.io/user')
        .then(response => response.json())
        .then(data => {
            setUsers(data);
            setLoading(false);
        })
        .catch(error => console.error(error));
    }, []);

    return (
    <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>
                Danh sách dạng ngang
            </Text>
            {loading ? <ActivityIndicator size="large" color="#0000ff"/> :
                <FlatList
                    horizontal={true}
                    data={users}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={({ item }) => (
                        <View style={{width: 200, margin: 5, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8}}>
                            <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                            <Text>{item.email}</Text>
                        </View>
                    )}
                    contentContainerStyle={{padding: 10}}
                    showsHorizontalScrollIndicator={true}
                />
            }
            
            <TouchableOpacity 
                style={{
                    padding: 15, 
                    borderRadius: 5, 
                    backgroundColor: '#5b1c1c', 
                    alignItems: 'center',
                    margin: 10
                }} 
                onPress={() => setStyleView(styleView === 'horizontal' ? 'vertical' : 'horizontal')}
            >
                <Text style={{color: '#ffffff', fontWeight: 'bold'}}>
                    Chuyển sang dạng {styleView === 'horizontal' ? 'dọc' : 'ngang'}
                </Text>
            </TouchableOpacity>

            {loading ? <ActivityIndicator size="large" color="#0000ff"/> :
                <FlatList
                    horizontal={styleView === 'horizontal'}
                    data={users}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={({ item }) => (
                        <View style={{
                            width: styleView === 'horizontal' ? 200 : '100%',
                            margin: 5, 
                            padding: 10, 
                            backgroundColor: '#f0f0f0', 
                            borderRadius: 8
                        }}>
                            <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                            <Text>{item.email}</Text>
                        </View>
                    )}
                    contentContainerStyle={{padding: 10}}
                    showsHorizontalScrollIndicator={styleView === 'horizontal'}
                    showsVerticalScrollIndicator={styleView === 'vertical'}
                />
            }
        </View>
    </SafeAreaView>
  )
}
export default UserList;