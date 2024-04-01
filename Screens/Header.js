import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";

const Header = (props) => {
  const [budget, setBudget] = useState(0);
  const expense = props.addExpense;
  const balance = budget - expense;

  // Function to handle budget update
  const handleBudgetUpdate = (newBudget) => {
    setBudget(newBudget);
  };

  useEffect(() => {
    if (budget === 0) {
      Alert.prompt(
        "Enter Budget",
        "Please enter your budget:",
        [
          {
            text: "Set Budget",
            onPress: (value) => {
              const parsedBudget = parseFloat(value);
              if (!isNaN(parsedBudget)) {
                setBudget(parsedBudget);
              } else {
                Alert.alert("Invalid Input", "Please enter a valid number.");
              }
            },
          },
        ],
        {
          cancelable: false,
          keyboardType: "numeric",
        }
      );
    }
  }, [budget]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.tab}>
          <Text style={styles.title}>Budget</Text>
          <TextInput
            style={styles.amount}
            keyboardType="numeric"
            onChangeText={(text) => handleBudgetUpdate(text)}
            value={budget.toString()}
          />
          <Text style={styles.dollar}>$</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.title}>Expense</Text>
          <Text style={styles.amount}>{"$ " + expense}</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.title}>Balance</Text>
          <Text style={styles.amount}>{"$ " + balance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "grey",
    borderRadius: 20,
  },
  innerContainer: {
    flexDirection: "row",
    elevation: 10,
  },
  tab: {
    flex: 1,
    padding: 3,
    alignItems: "center",
    borderRightColor: "white",
    borderRightWidth: 0.5,
    borderBottomColor: "white",
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 25,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 2,
  },
  amount: {
    fontSize: 20,
    color: "white",
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 2,
  },
  dollar: {
    marginTop: 39,
    position: "absolute",
    fontSize: 20,
    color: "white",
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 2,
    left: 30,
  },
});

export default Header;
