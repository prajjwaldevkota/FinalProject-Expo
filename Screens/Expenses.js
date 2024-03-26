import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';


const EXPENSES_FILE_URI = FileSystem.documentDirectory + 'expenses.json';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, [expenses]);

  const loadExpenses = async () => {
    try {
      const { exists, data } = await FileSystem.getInfoAsync(EXPENSES_FILE_URI);
      if (exists) {
        const content = await FileSystem.readAsStringAsync(EXPENSES_FILE_URI);
        const allExpenses = JSON.parse(content) || [];
        const todayExpenses = allExpenses.filter(expense => expense.date === new Date().toISOString().split('T')[0]);
        setExpenses(todayExpenses);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Today's Expenses:</Text>
      {expenses.map((expense, index) => (
        <Text key={index}>{expense.amount} on {expense.date} - {expense.category}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Expense;
