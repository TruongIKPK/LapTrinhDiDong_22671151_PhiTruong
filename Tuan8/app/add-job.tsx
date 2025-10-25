import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

export default function AddJob() {
  
  return (
    <SafeAreaView style={styles.container}>
      <SQLiteProvider databaseName="test.db">
        <Content />
      </SQLiteProvider>
    </SafeAreaView>
  );
}

export function Content() {

  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const userName = params.userName as string || 'Twinkle';
  const db = useSQLiteContext();

  const handleFinish = async () => {
    if (!jobTitle.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên công việc');
      return;
    }

    try {
      setLoading(true);
      await db.runAsync('INSERT INTO todos (title, completed) VALUES (?, ?)', jobTitle.trim(), 0);
      Alert.alert(
        'Thành công', 
        'Đã thêm công việc mới',
        [
          {
            text: 'OK',
            onPress: () => {
              setJobTitle('');
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm công việc mới');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Hi {userName}</Text>
            <Text style={styles.subGreeting}>Have a great day ahead</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>ADD YOUR JOB</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>📝</Text>
        <TextInput
          style={styles.input}
          placeholder="Input your job"
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholderTextColor="#999"
          editable={!loading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.finishButton, loading && styles.disabledButton]}
        onPress={handleFinish}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.finishButtonText}>FINISH →</Text>
        )}
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/200x150' }}
          style={styles.noteImage}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ddd',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 12,
    color: '#666',
  },
  backButton: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 40,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  finishButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteImage: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
  },
});