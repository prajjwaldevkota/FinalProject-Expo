import React, { useState, useEffect } from "react";
import {
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system";

const EXPENSES_FILE_URI = FileSystem.documentDirectory + "expenses.json";

const ExpenseItems = ({ title, price }) => (
  <View style={styles.outerContainer2}>
    <View style={styles.innerContainer2}>
      <Text style={styles.primaryText2}>{title}</Text>
    </View>
    <View style={styles.innerContainer2}>
      <Text style={styles.primaryText2}>{price}</Text>
    </View>
  </View>
);

const Expense = () => {
  const [transactions, setTransactions] = useState([]);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { exists } = await FileSystem.getInfoAsync(EXPENSES_FILE_URI);
      if (exists) {
        const content = await FileSystem.readAsStringAsync(EXPENSES_FILE_URI);
        const transactionsData = JSON.parse(content) || [];
        setTransactions(transactionsData);
        setExpense(calculateTotalExpense(transactionsData));
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const calculateTotalExpense = (transactionsData) => {
    return transactionsData.reduce((total, transaction) => {
      return total + getPrices(transaction.transactionItems);
    }, 0);
  };

  const getPrices = (transactions) => {
    return transactions.reduce((total, item) => {
      return total + parseInt(item.price);
    }, 0);
  };

  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.header}>
          <Text style={styles.secondaryText}>{item.date}</Text>
          {item.transactionItems.map((item, index) => (
            <ExpenseItems key={index} title={item.title} price={item.price} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.listContainer}>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>No transactions found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 4,
    paddingHorizontal: 15,
  },
  text: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  upperContainer: {
    marginTop: 40,
    justifyContent: "flex-start",
    flex: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingRight: 5,
  },
  title: {
    fontSize: 40,
    fontWeight: "400",
    color: "#0d0f8c",
    marginLeft: 10,
  },
  listContainer: {
    flex: 4,
    paddingHorizontal: 15,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  outerContainer: {
    margin: 5,
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#f7f2f5",
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
  },
  secondaryText: {
    color: "#706669",
    fontSize: 16,
  },
  innerContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  outerContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    padding: 4,
  },
  primaryText2: {
    color: "#d42251",
    fontSize: 18,
  },
});

export default Expense;
