import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Pressable,
} from "react-native";
import * as FileSystem from "expo-file-system";
import Header from "../Modules/header";

const EXPENSES_FILE_URI = FileSystem.documentDirectory + "expenses.json";

//renders the contents title and price
const ExpenseItems = ({ title, price }) => (
  <View style={styles.outerContainer2}>
    <View style={styles.innerContainer2}>
      <Text style={styles.primaryText2}>{title}</Text>
    </View>
    <View style={styles.innerContainer2}>
      <Text style={styles.primaryText2}>${price}</Text>
    </View>
  </View>
);

const Expense = () => {
  const [transactions, setTransactions] = useState([]);
  const [expense, setExpense] = useState(0);

  //refreshes every 1 second to get updated data from the file
  useEffect(() => {
    const timerId = setTimeout(() => {
      loadTransactions();
    }, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, [transactions]);

  //loads every transaction
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
      return total + getPrices(transaction.ExpenseItems);
    }, 0);
  };

  const getPrices = (transactions) => {
    return transactions.reduce((total, item) => {
      return total + parseInt(item.price);
    }, 0);
  };

  const deleteHandler = (id) => {};

  const renderTransaction = ({ item }) => {
    const formattedTime = new Date(item.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <Pressable onPress={deleteHandler(item.id)}>
        <View style={styles.outerContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.secondaryText}> {item.date} </Text>
            </View>
            <View>
              <Text style={styles.secondaryText}> {formattedTime} </Text>
            </View>
          </View>
          {item.ExpenseItems.map((item, index) => (
            <ExpenseItems key={index} title={item.title} price={item.price} />
          ))}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.listContainer}>
      <Header addExpense={expense} />
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noTransaction}>No transactions found. Enter Budget</Text>
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
  noTransaction: {
    marginTop: 200,
    fontSize: 20,
    textAlign: "center",
  },
});

export default Expense;
