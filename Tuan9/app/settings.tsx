import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { 
  getApiUrl, 
  saveApiUrl, 
  validateApiUrl, 
  testApiConnection,
  getAllApiTransactions 
} from '../lib/syncApi';

export default function SettingsScreen() {
  const router = useRouter();
  const [apiUrl, setApiUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'failed'>('unknown');

  // Load API URL khi component mount
  useEffect(() => {
    loadApiUrl();
  }, []);

  const loadApiUrl = async () => {
    try {
      const savedUrl = await getApiUrl();
      setApiUrl(savedUrl);
    } catch (error) {
      console.error('Error loading API URL:', error);
    }
  };

  // Lưu API URL
  const handleSaveApiUrl = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL API');
      return;
    }

    if (!validateApiUrl(apiUrl.trim())) {
      Alert.alert('Lỗi', 'URL không hợp lệ. Vui lòng nhập URL đúng định dạng (https://...)');
      return;
    }

    setIsLoading(true);
    try {
      await saveApiUrl(apiUrl.trim());
      Alert.alert('Thành công', 'URL API đã được lưu thành công!');
      setConnectionStatus('unknown'); // Reset connection status
    } catch (error) {
      console.error('Error saving API URL:', error);
      Alert.alert('Lỗi', 'Không thể lưu URL API');
    } finally {
      setIsLoading(false);
    }
  };

  // Test kết nối API
  const handleTestConnection = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL API trước khi test');
      return;
    }

    if (!validateApiUrl(apiUrl.trim())) {
      Alert.alert('Lỗi', 'URL không hợp lệ');
      return;
    }

    setIsTestingConnection(true);
    try {
      // Tạm thời lưu URL để test
      await saveApiUrl(apiUrl.trim());
      
      const isConnected = await testApiConnection();
      
      if (isConnected) {
        setConnectionStatus('success');
        Alert.alert('Thành công', 'Kết nối API thành công!');
      } else {
        setConnectionStatus('failed');
        Alert.alert('Lỗi', 'Không thể kết nối đến API. Vui lòng kiểm tra lại URL.');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus('failed');
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi test kết nối');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Xem data trong API
  const handleViewApiData = async () => {
    setIsLoading(true);
    try {
      const apiData = await getAllApiTransactions();
      Alert.alert(
        'Dữ liệu API',
        `Có ${apiData.length} giao dịch trong API`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error fetching API data:', error);
      Alert.alert('Lỗi', 'Không thể lấy dữ liệu từ API');
    } finally {
      setIsLoading(false);
    }
  };

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'success':
        return (
          <View style={[styles.statusContainer, styles.successStatus]}>
            <Ionicons name="checkmark-circle" size={16} color="#28a745" />
            <Text style={styles.successText}>Kết nối thành công</Text>
          </View>
        );
      case 'failed':
        return (
          <View style={[styles.statusContainer, styles.errorStatus]}>
            <Ionicons name="close-circle" size={16} color="#dc3545" />
            <Text style={styles.errorText}>Kết nối thất bại</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài Đặt Đồng Bộ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* API URL Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cấu Hình API</Text>
          <Text style={styles.sectionDescription}>
            Nhập URL MockAPI để đồng bộ dữ liệu giao dịch
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>URL API *</Text>
            <TextInput
              style={styles.textInput}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="https://your-mockapi-url.com/api/v1/transactions"
              placeholderTextColor="#aaa"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {renderConnectionStatus()}
          </View>

          {/* API URL Example */}
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Ví dụ URL MockAPI:</Text>
            <Text style={styles.exampleText}>
              https://6721ce4398bbb4d93ca7e8e3.mockapi.io/api/v1/transactions
            </Text>
            <Text style={styles.noteText}>
              💡 Tạo MockAPI tại https://mockapi.io/ với schema:
            </Text>
            <View style={styles.schemaContainer}>
              <Text style={styles.schemaText}>
                {`{
  "title": "string",
  "amount": "number", 
  "category": "string",
  "description": "string",
  "createdAt": "string",
  "type": "string",
  "deleted": "number"
}`}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.testButton]}
              onPress={handleTestConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="wifi" size={16} color="#fff" />
              )}
              <Text style={styles.actionButtonText}>Test Kết Nối</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveApiUrl}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="save" size={16} color="#fff" />
              )}
              <Text style={styles.actionButtonText}>Lưu Cấu Hình</Text>
            </TouchableOpacity>
          </View>

          {/* View API Data Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={handleViewApiData}
            disabled={isLoading}
          >
            <Ionicons name="eye" size={16} color="#007bff" />
            <Text style={[styles.actionButtonText, styles.viewButtonText]}>Xem Dữ Liệu API</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hướng Dẫn</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1.</Text>
            <Text style={styles.instructionText}>
              Tạo tài khoản tại https://mockapi.io/
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2.</Text>
            <Text style={styles.instructionText}>
              Tạo project mới và endpoint "transactions"
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3.</Text>
            <Text style={styles.instructionText}>
              Copy URL endpoint và paste vào ô trên
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>4.</Text>
            <Text style={styles.instructionText}>
              Test kết nối và lưu cấu hình
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>5.</Text>
            <Text style={styles.instructionText}>
              Sử dụng nút "Đồng Bộ" trong màn hình chính
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#212529',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  successStatus: {
    backgroundColor: '#d4edda',
  },
  errorStatus: {
    backgroundColor: '#f8d7da',
  },
  successText: {
    color: '#155724',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    color: '#721c24',
    fontSize: 12,
    fontWeight: '500',
  },
  exampleContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 12,
    color: '#007bff',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  schemaContainer: {
    backgroundColor: '#2d3748',
    borderRadius: 6,
    padding: 8,
  },
  schemaText: {
    fontSize: 11,
    color: '#e2e8f0',
    fontFamily: 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  testButton: {
    backgroundColor: '#17a2b8',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  viewButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButtonText: {
    color: '#007bff',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
});