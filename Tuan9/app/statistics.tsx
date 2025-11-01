import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from 'expo-router';
import { getMonthlyStatistics, MonthlyStatistics } from '../lib/db';

const { width } = Dimensions.get('window');
const chartWidth = width - 40; // Padding 20 on each side

export default function StatisticsScreen() {
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState<MonthlyStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Load dữ liệu thống kê
  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const data = await getMonthlyStatistics(selectedYear);
      setMonthlyData(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu thống kê');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [selectedYear]);

  // Reload khi focus vào screen
  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [selectedYear])
  );

  // Tính toán max value cho scale biểu đồ
  const getMaxValue = () => {
    const maxIncome = Math.max(...monthlyData.map(d => d.income));
    const maxExpense = Math.max(...monthlyData.map(d => d.expense));
    return Math.max(maxIncome, maxExpense, 1000000); // Tối thiểu 1M để chart đẹp
  };

  // Format số tiền
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M₫';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K₫';
    }
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const formatFullCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  // Render bar chart item
  const renderChartBar = (data: MonthlyStatistics, index: number) => {
    const maxValue = getMaxValue();
    const incomeHeight = (data.income / maxValue) * 150; // Max height 150px
    const expenseHeight = (data.expense / maxValue) * 150;
    const barWidth = (chartWidth - 60) / 12; // 60px for margin, 12 months

    return (
      <View key={index} style={[styles.chartBar, { width: barWidth }]}>
        {/* Values on top */}
        <View style={styles.valueContainer}>
          {data.income > 0 && (
            <Text style={styles.incomeValue}>{formatCurrency(data.income)}</Text>
          )}
          {data.expense > 0 && (
            <Text style={styles.expenseValue}>{formatCurrency(data.expense)}</Text>
          )}
        </View>
        
        {/* Bars */}
        <View style={styles.barsContainer}>
          <View style={styles.barGroup}>
            <View
              style={[
                styles.incomeBar,
                { height: Math.max(incomeHeight, 2) } // Minimum height 2px
              ]}
            />
            <View
              style={[
                styles.expenseBar,
                { height: Math.max(expenseHeight, 2) }
              ]}
            />
          </View>
        </View>
        
        {/* Month label */}
        <Text style={styles.monthLabel}>T{data.month}</Text>
      </View>
    );
  };

  // Tính tổng cộng
  const totalIncome = monthlyData.reduce((sum, data) => sum + data.income, 0);
  const totalExpense = monthlyData.reduce((sum, data) => sum + data.expense, 0);
  const netAmount = totalIncome - totalExpense;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Year Selector */}
        <View style={styles.yearSelector}>
          <TouchableOpacity
            style={styles.yearButton}
            onPress={() => setSelectedYear(selectedYear - 1)}
          >
            <Ionicons name="chevron-back" size={20} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.yearText}>Năm {selectedYear}</Text>
          <TouchableOpacity
            style={styles.yearButton}
            onPress={() => setSelectedYear(selectedYear + 1)}
          >
            <Ionicons name="chevron-forward" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, styles.incomeCard]}>
              <Ionicons name="arrow-down" size={24} color="#28a745" />
              <Text style={styles.summaryAmount}>{formatFullCurrency(totalIncome)}</Text>
              <Text style={styles.summaryLabel}>Tổng Thu</Text>
            </View>
            
            <View style={[styles.summaryCard, styles.expenseCard]}>
              <Ionicons name="arrow-up" size={24} color="#dc3545" />
              <Text style={styles.summaryAmount}>{formatFullCurrency(totalExpense)}</Text>
              <Text style={styles.summaryLabel}>Tổng Chi</Text>
            </View>
          </View>
          
          <View style={[styles.summaryCard, styles.netCard, netAmount >= 0 ? styles.positiveNet : styles.negativeNet]}>
            <Ionicons 
              name={netAmount >= 0 ? "trending-up" : "trending-down"} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.netAmount}>{formatFullCurrency(Math.abs(netAmount))}</Text>
            <Text style={styles.netLabel}>
              {netAmount >= 0 ? 'Lợi nhuận' : 'Thua lỗ'}
            </Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Biểu đồ Thu - Chi theo tháng</Text>
          
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#28a745' }]} />
              <Text style={styles.legendText}>Thu nhập</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#dc3545' }]} />
              <Text style={styles.legendText}>Chi tiêu</Text>
            </View>
          </View>

          {/* Chart */}
          <View style={styles.chartContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chartScrollContent}
            >
              <View style={styles.chartContent}>
                {monthlyData.map((data, index) => renderChartBar(data, index))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Monthly Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Chi tiết theo tháng</Text>
          {monthlyData.map((data, index) => (
            <View key={index} style={styles.monthlyDetailCard}>
              <View style={styles.monthlyHeader}>
                <Text style={styles.monthlyTitle}>Tháng {data.month}</Text>
                <Text style={styles.transactionCount}>
                  {data.transactionCount} giao dịch
                </Text>
              </View>
              
              <View style={styles.monthlyStats}>
                <View style={styles.statRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="arrow-down" size={16} color="#28a745" />
                    <Text style={styles.statLabel}>Thu</Text>
                  </View>
                  <Text style={[styles.statValue, styles.incomeText]}>
                    {formatFullCurrency(data.income)}
                  </Text>
                </View>
                
                <View style={styles.statRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="arrow-up" size={16} color="#dc3545" />
                    <Text style={styles.statLabel}>Chi</Text>
                  </View>
                  <Text style={[styles.statValue, styles.expenseText]}>
                    {formatFullCurrency(data.expense)}
                  </Text>
                </View>
                
                <View style={[styles.statRow, styles.netRow]}>
                  <View style={styles.statItem}>
                    <Ionicons 
                      name={data.net >= 0 ? "trending-up" : "trending-down"} 
                      size={16} 
                      color={data.net >= 0 ? "#28a745" : "#dc3545"} 
                    />
                    <Text style={styles.statLabel}>Ròng</Text>
                  </View>
                  <Text style={[
                    styles.statValue, 
                    data.net >= 0 ? styles.incomeText : styles.expenseText
                  ]}>
                    {data.net >= 0 ? '+' : '-'}{formatFullCurrency(Math.abs(data.net))}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  yearButton: {
    padding: 10,
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginHorizontal: 30,
  },
  summarySection: {
    padding: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  netCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  positiveNet: {
    backgroundColor: '#28a745',
  },
  negativeNet: {
    backgroundColor: '#dc3545',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 8,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  netAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  netLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  chartSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 14,
    color: '#6c757d',
  },
  chartContainer: {
    height: 200,
  },
  chartScrollContent: {
    paddingHorizontal: 10,
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 180,
    gap: 4,
  },
  chartBar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  valueContainer: {
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 4,
  },
  incomeValue: {
    fontSize: 10,
    color: '#28a745',
    fontWeight: '600',
  },
  expenseValue: {
    fontSize: 10,
    color: '#dc3545',
    fontWeight: '600',
  },
  barsContainer: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  incomeBar: {
    width: 12,
    backgroundColor: '#28a745',
    borderRadius: 2,
  },
  expenseBar: {
    width: 12,
    backgroundColor: '#dc3545',
    borderRadius: 2,
  },
  monthLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 4,
    fontWeight: '500',
  },
  detailsSection: {
    padding: 20,
  },
  monthlyDetailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthlyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  transactionCount: {
    fontSize: 12,
    color: '#6c757d',
  },
  monthlyStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 8,
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  incomeText: {
    color: '#28a745',
  },
  expenseText: {
    color: '#dc3545',
  },
});