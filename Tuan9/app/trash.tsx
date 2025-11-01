import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDeletedTransactions, restoreTransaction, deleteTransaction, Transaction } from '../lib/db';

export default function TrashScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDeleted = async () => {
    setIsLoading(true);
    try {
      const deleted = await getDeletedTransactions();
      setItems(deleted);
    } catch (error) {
      console.error('Error loading deleted items:', error);
      Alert.alert('Lỗi', 'Không thể tải thùng rác');
    } finally {
      setIsLoading(false);
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
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không có giao dịch trong thùng rác</Text>
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
  emptyText: { color: '#6c757d' }
});
