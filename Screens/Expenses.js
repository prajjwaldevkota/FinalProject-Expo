import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const EXPENSES_FILE_URI = FileSystem.documentDirectory + 'expenses.json';

const Expense = () => {
  const [expensesByDate, setExpensesByDate] = useState({});
  const [dataChanged, setDataChanged] = useState(false);

  

  useEffect(() => {
    loadExpenses();
  }, []); // Load expenses once when the component mounts

  const loadExpenses = async () => {
    try {
      const result = await FileSystem.readAsStringAsync(EXPENSES_FILE_URI);
      console.log(result);
      const allExpenses = JSON.parse(result) || [];

      // Group expenses by date
      const groupedExpenses = allExpenses.reduce((acc, expense) => {
        const date = expense.date.split('T')[0];
        acc[date] = acc[date] || [];
        acc[date].push(expense);
        return acc;
      }, {});

      setExpensesByDate(groupedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  return (
    <View style={styles.container}>
      {Object.entries(expensesByDate).map(([date, expenses]) => (
        <View key={date}>
          <Text>{date}</Text>
          {expenses.map((expense, index) => (
            <Text key={index}>{expense.amount} - {expense.category}</Text>
          ))}
        </View>
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
