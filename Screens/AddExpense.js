import React, { useState, useEffect } from "react";
import { Input } from "react-native-elements";
import { Dialog, CheckBox } from "@rneui/themed";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { readExpensesFromFile, writeExpensesToFile } from "../Modules/storage";

const AddExpense = () => {
  const [enteredItem, setEnteredItem] = useState("");
  const [enteredPrice, setEnteredPrice] = useState(0);
  const [enteredCategory, setCategory] = useState("Others");
  const [ExpenseItems, setExpenseItems] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(0);
  const [currentDate, setCurrentDate] = useState("");

  const handleTitleInput = (enteredValue) => {
    setEnteredItem(enteredValue);
  };

  const handlePriceInput = (enteredValue) => {
    setEnteredPrice(enteredValue);
  };

  const handleCategoryInput = (enteredCategory) => {
    setCategory(enteredCategory);
  };

  useEffect(() => {
    const checkDateChange = async () => {
      const currentDate = new Date().toISOString().split("T")[0];
      const existingExpenses = await readExpensesFromFile();
      const lastExpenseDate =
        existingExpenses.length > 0
          ? existingExpenses[existingExpenses.length - 1].date
          : null;
      console.log(lastExpenseDate);
      if (lastExpenseDate == null) {
        setCurrentDate(currentDate);
        setCurrentId(currentId);
      } else if (lastExpenseDate !== currentDate) {
        setCurrentDate(currentDate);
        setCurrentId(currentId + 1);
      }
    };
    checkDateChange();
  }, []);

  const addExpenseToFileHandler = async () => {
    const date = new Date();
    const Expense = {
      id: currentId,
      date: date.toISOString().split("T")[0],
      time: date.getTime(),
      ExpenseItems: [...ExpenseItems],
    };

    try {
      let updatedExpenses;
      const existingExpenses = await readExpensesFromFile();

      if (existingExpenses.length === 0) {
        setExpenseItems([]);
        console.log(Expense);
        updatedExpenses = [Expense];
      } else {
        const existingExpenseIndex = existingExpenses.findIndex(
          (expense) => expense.id === Expense.id
        );
        if (existingExpenseIndex !== -1) {
          existingExpenses[existingExpenseIndex].ExpenseItems.push(
            ...Expense.ExpenseItems
          );
        } else {
          existingExpenses.push(Expense);
        }
        updatedExpenses = existingExpenses;
      }

      await writeExpensesToFile(updatedExpenses);

      Alert.alert("Save Expense", "The expenses have been saved successfully.");
    } catch (error) {
      console.error("Error Occurred: ", error);
      Alert.alert("Error", "Error Occurred When adding transaction");
    }
  };

  const addExpenseItemHandler = () => {
    setExpenseItems((currentExpenseItems) => [
      ...currentExpenseItems,
      {
        title: enteredItem,
        price: enteredPrice,
        category: enteredCategory,
      },
    ]);

    Alert.alert("Add Expense", "The expenses have been Added successfully.");
    setEnteredItem("");
    setEnteredPrice(0);
    setCategory("");
  };

  const toggleDialog = () => {
    setVisible(!visible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Expense</Text>
      <View style={styles.outerContainer}>
        <View style={styles.inputContainer}>
          <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
            <Dialog.Title title="Select Category" />
            {[
              "Food",
              "Education",
              "Transport",
              "Shopping",
              "Coffee",
              "Stationary",
              "Others",
            ].map((category, index) => (
              <CheckBox
                key={index}
                title={category}
                containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={enteredCategory === category && checked === index + 1}
                onPress={() => {
                  setCategory(category);
                  setChecked(index + 1);
                }}
              />
            ))}

            <Dialog.Actions>
              <View style={styles.dialogButtonContainer}>
                <Dialog.Button title="CANCEL" onPress={toggleDialog} />
                <Dialog.Button
                  title="CONFIRM"
                  onPress={() => {
                    handleCategoryInput(enteredCategory);
                    toggleDialog();
                  }}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
          <Input
            style={styles.textInput}
            placeholder="Item"
            onChangeText={handleTitleInput}
            value={enteredItem}
          />
          <Input
            style={styles.textInput}
            placeholder="Price"
            keyboardType="number-pad"
            onChangeText={handlePriceInput}
            value={enteredPrice.toString()}
          />
          <Pressable onPress={toggleDialog} style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Set Category</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={addExpenseItemHandler}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}> Add Expense </Text>
          </Pressable>
          <Pressable
            onPress={addExpenseToFileHandler}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}> Done </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    padding: 5,
  },
  outerContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 15,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    width: 300,
    padding: 15,
    backgroundColor: "white",
    opacity: 0.7,
    borderRadius: 10,
    elevation: 20,
    borderWidth: 0.5,
    borderColor: "black",
    elevation: 10,
  },
  dialogButtonContainer: {
    flexDirection: "row",
  },
  title: {
    fontSize: 36,
    color: "#0d0f8c",
    marginLeft: 10,
    marginBottom: 10,
  },
  primaryButton: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    backgroundColor: "#56729Q",
    borderWidth: 0.5,
    borderColor: "black",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    elevation: 1,
  },
  secondaryButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#de687a",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderColor: "black",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "400",
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default AddExpense;
