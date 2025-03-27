import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { BarChart, DollarSign, ArrowDownCircle, ArrowUpCircle, Filter, PlusCircle } from 'lucide-react-native';

// Type definitions
type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  buildingId: string;
};

type ExpenseSummary = {
  expenses: Expense[];
  budget: number;
  totalSpent: number;
  monthlySummary: { month: string; amount: number }[];
  categorySummary: { category: string; amount: number; percentage: number }[];
};

type Building = {
  id: string;
  name: string;
  blocks: { name: string }[];
};

const ExpenseAnalytics = ({ route, navigation }: any) => {
  const { building }: { building: Building } = route.params;
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState<ExpenseSummary | null>(null);
  const [timeframe, setTimeframe] = useState('quarterly'); // monthly, quarterly, yearly

  // Sample expense data - in a real app, this would come from an API or database
  const generateSampleData = (building: Building): ExpenseSummary => {
    return {
      expenses: [
        { id: '1', category: 'Maintenance', amount: 2500, date: '2025-01-15', description: 'Elevator servicing', buildingId: building.id },
        { id: '2', category: 'Utilities', amount: 1800, date: '2025-02-10', description: 'Common area electricity', buildingId: building.id },
        { id: '3', category: 'Cleaning', amount: 1200, date: '2025-02-25', description: 'Weekly cleaning services', buildingId: building.id },
        { id: '4', category: 'Repairs', amount: 3500, date: '2025-03-05', description: `Plumbing repairs in Block ${building.blocks[0]?.name || 'A'}`, buildingId: building.id },
        { id: '5', category: 'Security', amount: 2000, date: '2025-03-12', description: 'Security system upgrade', buildingId: building.id },
      ],
      budget: 15000,
      totalSpent: 11000,
      monthlySummary: [
        { month: 'Jan', amount: 2500 },
        { month: 'Feb', amount: 3000 },
        { month: 'Mar', amount: 5500 },
      ],
      categorySummary: [
        { category: 'Maintenance', amount: 2500, percentage: 22.7 },
        { category: 'Utilities', amount: 1800, percentage: 16.4 },
        { category: 'Cleaning', amount: 1200, percentage: 10.9 },
        { category: 'Repairs', amount: 3500, percentage: 31.8 },
        { category: 'Security', amount: 2000, percentage: 18.2 },
      ]
    };
  };
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setExpenseData(generateSampleData(building));
      setLoading(false);
    }, 1000);
  }, [building]);

  // Handle adding a new expense
  const handleAddExpense = () => {
    if (building.blocks.length === 0) {
      Alert.alert(
        "No Blocks Available",
        "Please add blocks to this building before adding expenses.",
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate('ManageExpense', { 
      building,
      onSave: (newExpense: Expense) => {
        if (!expenseData) return;
        
        const newId = (expenseData.expenses.length > 0 
          ? Math.max(...expenseData.expenses.map(e => parseInt(e.id))) + 1 
          : 1).toString();
        
        const updatedExpenses = [...expenseData.expenses, { ...newExpense, id: newId }];
        const totalSpent = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Update category summary
        const categoryCounts: {[key: string]: number} = {};
        updatedExpenses.forEach(expense => {
          categoryCounts[expense.category] = (categoryCounts[expense.category] || 0) + expense.amount;
        });
        
        const categorySummary = Object.entries(categoryCounts).map(([category, amount]) => ({
          category,
          amount,
          percentage: (amount / totalSpent) * 100
        }));
        
        setExpenseData({
          ...expenseData,
          expenses: updatedExpenses,
          totalSpent,
          categorySummary
        });
      }
    });
  };

  // Handle editing an expense
  const handleEditExpense = (expense: Expense) => {
    navigation.navigate('ManageExpense', { 
      building,
      expense,
      onSave: (updatedExpense: Expense) => {
        if (!expenseData) return;
        
        const updatedExpenses = expenseData.expenses.map(e => 
          e.id === updatedExpense.id ? updatedExpense : e
        );
        
        const totalSpent = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Update category summary
        const categoryCounts: {[key: string]: number} = {};
        updatedExpenses.forEach(expense => {
          categoryCounts[expense.category] = (categoryCounts[expense.category] || 0) + expense.amount;
        });
        
        const categorySummary = Object.entries(categoryCounts).map(([category, amount]) => ({
          category,
          amount,
          percentage: (amount / totalSpent) * 100
        }));
        
        setExpenseData({
          ...expenseData,
          expenses: updatedExpenses,
          totalSpent,
          categorySummary
        });
      }
    });
  };

  // Handle deleting an expense
  const handleDeleteExpense = (expense: Expense) => {
    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete ${expense.description}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            if (!expenseData) return;
            
            const updatedExpenses = expenseData.expenses.filter(e => e.id !== expense.id);
            const totalSpent = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            
            // Update category summary
            const categoryCounts: {[key: string]: number} = {};
            updatedExpenses.forEach(expense => {
              categoryCounts[expense.category] = (categoryCounts[expense.category] || 0) + expense.amount;
            });
            
            const categorySummary = Object.entries(categoryCounts).map(([category, amount]) => ({
              category,
              amount,
              percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
            }));
            
            setExpenseData({
              ...expenseData,
              expenses: updatedExpenses,
              totalSpent,
              categorySummary
            });
          },
          style: "destructive"
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4361ee" />
        <Text style={styles.loadingText}>Loading expense data...</Text>
      </SafeAreaView>
    );
  }

  if (!expenseData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load expense data.</Text>
      </SafeAreaView>
    );
  }

  const remainingBudget = expenseData.budget - expenseData.totalSpent;
  const budgetPercentage = (expenseData.totalSpent / expenseData.budget) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.heading}>Expense Analytics</Text>
            <Text style={styles.subheading}>{building.name}</Text>
          </View>
        </View>
        
        {/* Budget Overview Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Budget Overview</Text>
          <View style={styles.budgetContainer}>
            <View style={styles.budgetTotalContainer}>
              <Text style={styles.budgetLabel}>Total Budget</Text>
              <Text style={styles.budgetAmount}>${expenseData.budget.toLocaleString()}</Text>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[
                styles.progressBar, 
                { 
                  width: `${Math.min(budgetPercentage, 100)}%`,
                  backgroundColor: budgetPercentage > 90 ? '#ef476f' : '#4361ee'
                }
              ]} />
            </View>
            
            <View style={styles.budgetInfoRow}>
              <View style={styles.budgetInfoItem}>
                <View style={[styles.infoIcon, styles.spentIcon]}>
                  <ArrowUpCircle size={16} color="#fff" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Spent</Text>
                  <Text style={styles.infoAmount}>${expenseData.totalSpent.toLocaleString()}</Text>
                </View>
              </View>
              
              <View style={styles.budgetInfoItem}>
                <View style={[styles.infoIcon, styles.remainingIcon]}>
                  <ArrowDownCircle size={16} color="#fff" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Remaining</Text>
                  <Text style={styles.infoAmount}>${remainingBudget.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Time Period Selector */}
        <View style={styles.timeframeContainer}>
          <Text style={styles.sectionTitle}>Expenses By Period</Text>
          <View style={styles.timeframeButtons}>
            <TouchableOpacity 
              style={[styles.timeframeButton, timeframe === 'monthly' && styles.timeframeButtonActive]}
              onPress={() => setTimeframe('monthly')}
            >
              <Text style={[styles.timeframeText, timeframe === 'monthly' && styles.timeframeTextActive]}>Monthly</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.timeframeButton, timeframe === 'quarterly' && styles.timeframeButtonActive]}
              onPress={() => setTimeframe('quarterly')}
            >
              <Text style={[styles.timeframeText, timeframe === 'quarterly' && styles.timeframeTextActive]}>Quarterly</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.timeframeButton, timeframe === 'yearly' && styles.timeframeButtonActive]}
              onPress={() => setTimeframe('yearly')}
            >
              <Text style={[styles.timeframeText, timeframe === 'yearly' && styles.timeframeTextActive]}>Yearly</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Monthly Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Monthly Breakdown</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#4361ee" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
          
          {/* Simple Chart Visualization */}
          <View style={styles.chartContainer}>
            {expenseData.monthlySummary.map((item, index) => (
              <View key={index} style={styles.chartItem}>
                <View style={styles.chartBarContainer}>
                  <View 
                    style={[
                      styles.chartBar, 
                      { 
                        height: `${(item.amount / Math.max(...expenseData.monthlySummary.map(i => i.amount))) * 100}%`,
                        backgroundColor: getBarColor(index)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.chartLabel}>{item.month}</Text>
                <Text style={styles.chartValue}>${item.amount}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Category Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Expense Categories</Text>
          
          {expenseData.categorySummary.map((item, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) }]}>
                  <DollarSign size={14} color="#fff" />
                </View>
                <Text style={styles.categoryName}>{item.category}</Text>
                <Text style={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</Text>
              </View>
              
              <View style={styles.categoryProgressContainer}>
                <View 
                  style={[
                    styles.categoryProgress, 
                    { 
                      width: `${item.percentage}%`,
                      backgroundColor: getCategoryColor(item.category)
                    }
                  ]} 
                />
              </View>
              
              <Text style={styles.categoryAmount}>${item.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>
        
        {/* Recent Expenses */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Expenses</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => navigation.navigate('AllExpenses', { building, expenses: expenseData.expenses })}
            >
              <Text style={styles.filterText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {expenseData.expenses.length > 0 ? (
            expenseData.expenses.slice(0, 5).map((expense, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.expenseItem}
                onPress={() => handleEditExpense(expense)}
              >
                <View style={styles.expenseDetails}>
                  <Text style={styles.expenseDescription}>{expense.description}</Text>
                  <Text style={styles.expenseCategory}>{expense.category} • {expense.date}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <Text style={styles.expenseAmount}>${expense.amount.toLocaleString()}</Text>
                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteExpense(expense);
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No expenses recorded for this building.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <PlusCircle size={22} color="white" />
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Helper functions for colors
const getBarColor = (index: number) => {
  const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];
  return colors[index % colors.length];
};

const getCategoryColor = (category: string) => {
  const categoryColors: {[key: string]: string} = {
    'Maintenance': '#4361ee',
    'Utilities': '#3a0ca3',
    'Cleaning': '#7209b7',
    'Repairs': '#f72585',
    'Security': '#4cc9f0',
  };
  
  return categoryColors[category] || '#4361ee';
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ef476f',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4361ef',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: '#4361ee',
    marginLeft: 4,
  },
  budgetContainer: {
    marginBottom: 8,
  },
  budgetTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  budgetInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  spentIcon: {
    backgroundColor: '#f44336',
  },
  remainingIcon: {
    backgroundColor: '#4caf50',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  timeframeContainer: {
    marginTop: 8,
  },
  timeframeButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  timeframeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  timeframeButtonActive: {
    backgroundColor: '#4361ee',
  },
  timeframeText: {
    fontSize: 14,
    color: '#666',
  },
  timeframeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartContainer: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    width: 24,
    height: 120,
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  chartValue: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  categoryProgressContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  categoryProgress: {
    height: '100%',
    borderRadius: 3,
  },
  categoryAmount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef476f',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4361ee',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ExpenseAnalytics;