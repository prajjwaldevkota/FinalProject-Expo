import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const EXPENSES_FILE_URI = FileSystem.documentDirectory + 'expenses.json';

const AddExpense = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const saveExpense = async () => {
    const newExpense = {
      amount: parseFloat(amount), // Parse amount to float
      category,
      date: new Date().toISOString().split('T')[0] // Today's date
    };
  
    try {
      // Check if the file exists
      const { exists } = await FileSystem.getInfoAsync(EXPENSES_FILE_URI);
      
      // If the file doesn't exist, create it with an empty array
      if (!exists) {
        await FileSystem.writeAsStringAsync(EXPENSES_FILE_URI, '[]');
      }
  
      // Read the existing content of the file
      const content = await FileSystem.readAsStringAsync(EXPENSES_FILE_URI);
      const expenses = JSON.parse(content) || [];
  
      // Add the new expense to the existing list
      const newExpenses = [...expenses, newExpense];
  
      // Write the updated list back to the file
      await FileSystem.writeAsStringAsync(EXPENSES_FILE_URI, JSON.stringify(newExpenses));
  
      // Optionally, navigate back to the previous screen
       navigation.goBack();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text>Add Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <Button title="Save Expense" onPress={saveExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default AddExpense;
