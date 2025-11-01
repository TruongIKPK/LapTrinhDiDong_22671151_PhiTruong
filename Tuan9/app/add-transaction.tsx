import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addTransaction } from '../lib/db';

export default function AddTransactionScreen() {
  const router = useRouter();
  
  // useRef để clear form sau khi save
  const titleRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);
  const categoryRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  
  // State cho form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isLoading, setIsLoading] = useState(false);

  // Categories dự định
  const incomeCategories = ['Lương', 'Thưởng', 'Bán hàng', 'Đầu tư', 'Khác'];
  const expenseCategories = ['Thực phẩm', 'Giao thông', 'Giải trí', 'Y tế', 'Học tập', 'Mua sắm', 'Khác'];

  // Xử lý save transaction
  const handleSave = async () => {
    // Validate form
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề');
      return;
    }
    
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    if (!category.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập danh mục');
      return;
    }

    setIsLoading(true);
    
    try {
      // Tạo transaction object
      const newTransaction = {
        title: title.trim(),
        amount: Number(amount),
        category: category.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        type: type,
      };

      // Lưu vào database
      await addTransaction(newTransaction);
      
      // Clear form sử dụng useRef
      titleRef.current?.clear();
      amountRef.current?.clear();
      categoryRef.current?.clear();
      descriptionRef.current?.clear();
      
      // Reset state
      setTitle('');
      setAmount('');
      setCategory('');
      setDescription('');
      setType('expense');
      
      Alert.alert(
        'Thành công', 
        'Giao dịch đã được thêm thành công!',
        [
          {
            text: 'Thêm tiếp',
            style: 'default'
          },
          {
            text: 'Quay lại',
            onPress: () => router.back(),
            style: 'cancel'
          }
        ]
      );
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu giao dịch');
    } finally {
      setIsLoading(false);
    }
  };

  // Chọn category nhanh
  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thêm Giao Dịch</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loại Giao Dịch</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' ? styles.incomeButton : styles.inactiveButton
                ]}
                onPress={() => setType('income')}
              >
                <Ionicons 
                  name="arrow-down" 
                  size={16} 
                  color={type === 'income' ? '#fff' : '#28a745'} 
                />
                <Text style={[
                  styles.typeText,
                  type === 'income' ? styles.activeTypeText : styles.inactiveTypeText
                ]}>
                  Thu Nhập
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' ? styles.expenseButton : styles.inactiveButton
                ]}
                onPress={() => setType('expense')}
              >
                <Ionicons 
                  name="arrow-up" 
                  size={16} 
                  color={type === 'expense' ? '#fff' : '#dc3545'} 
                />
                <Text style={[
                  styles.typeText,
                  type === 'expense' ? styles.activeTypeText : styles.inactiveTypeText
                ]}>
                  Chi Tiêu
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông Tin Giao Dịch</Text>
            
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tiêu đề *</Text>
              <TextInput
                ref={titleRef}
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề giao dịch"
                placeholderTextColor="#aaa"
              />
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số tiền *</Text>
              <TextInput
                ref={amountRef}
                style={styles.textInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
              />
            </View>

            {/* Category Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Danh mục *</Text>
              <TextInput
                ref={categoryRef}
                style={styles.textInput}
                value={category}
                onChangeText={setCategory}
                placeholder="Nhập danh mục"
                placeholderTextColor="#aaa"
              />
              
              {/* Quick Category Selection */}
              <View style={styles.categoryContainer}>
                {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.selectedCategoryChip
                    ]}
                    onPress={() => selectCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      category === cat && styles.selectedCategoryChipText
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mô tả</Text>
              <TextInput
                ref={descriptionRef}
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Nhập mô tả (tùy chọn)"
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              isLoading && styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Đang lưu...</Text>
            ) : (
              <>
                <Ionicons name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Lưu Giao Dịch</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 15,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  incomeButton: {
    backgroundColor: '#28a745',
  },
  expenseButton: {
    backgroundColor: '#dc3545',
  },
  inactiveButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTypeText: {
    color: '#fff',
  },
  inactiveTypeText: {
    color: '#6c757d',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  categoryChip: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedCategoryChip: {
    backgroundColor: '#007bff',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  saveButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});