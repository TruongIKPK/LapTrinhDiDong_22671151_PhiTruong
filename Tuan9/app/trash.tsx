import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDeletedTransactions, restoreTransaction, deleteTransaction, Transaction } from '../lib/db';

export default function TrashScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Transaction[]>([]);
  const [filteredItems, setFilteredItems] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const loadDeleted = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const deleted = await getDeletedTransactions();
      setItems(deleted);
      setFilteredItems(deleted);
    } catch (error) {
      console.error('Error loading deleted items:', error);
      if (!isRefresh) {
        Alert.alert('Lỗi', 'Không thể tải thùng rác');
      }
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadDeleted();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDeleted();
    }, [])
  );

  const onRefresh = () => {
    loadDeleted(true);
  };

  const handleRestore = async (id?: number) => {
    if (!id) return;
    try {
      await restoreTransaction(id);
      Alert.alert('Đã khôi phục', 'Giao dịch đã được khôi phục');
      loadDeleted();
    } catch (error) {
      console.error('Error restoring:', error);
      Alert.alert('Lỗi', 'Không thể khôi phục giao dịch');
    }
  };

  const handlePermanentDelete = (id?: number) => {
    if (!id) return;
    Alert.alert(
      'Xóa vĩnh viễn',
      'Giao dịch sẽ bị xóa hoàn toàn. Bạn có chắc chắn?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            await deleteTransaction(id);
            Alert.alert('Đã xóa', 'Giao dịch đã bị xóa vĩnh viễn');
            loadDeleted();
          } catch (error) {
            console.error('Error permanently deleting:', error);
            Alert.alert('Lỗi', 'Không thể xóa giao dịch');
          }
        }}
      ]
    );
  };

  // Xử lý tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
      setFilteredItems(items);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemMeta}>{item.category} • {item.createdAt}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.restoreButton} onPress={() => handleRestore(item.id)}>
          <Ionicons name="arrow-undo" size={18} color="#fff" />
          <Text style={styles.actionText}>Khôi phục</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permDeleteButton} onPress={() => handlePermanentDelete(item.id)}>
          <Ionicons name="trash" size={18} color="#fff" />
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thùng Rác</Text>
        <TouchableOpacity onPress={toggleSearch} style={styles.searchButton}>
          <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#6c757d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm trong thùng rác..."
              placeholderTextColor="#6c757d"
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#6c757d" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(i) => i.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            title="Đang làm mới..."
            titleColor="#007AFF"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Không tìm thấy giao dịch nào' : 'Không có giao dịch trong thùng rác'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemInfo: { flex: 1, marginRight: 12 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#212529' },
  itemMeta: { fontSize: 12, color: '#6c757d', marginTop: 6 },
  itemActions: { flexDirection: 'row', gap: 8 },
  restoreButton: { backgroundColor: '#28a745', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  permDeleteButton: { backgroundColor: '#dc3545', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: '#fff', fontSize: 12, marginLeft: 4 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#6c757d' },
  searchButton: { padding: 4 },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
  },
  clearButton: {
    marginLeft: 8,
  },
});
