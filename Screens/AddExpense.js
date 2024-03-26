import React, { useState } from "react";
import { Input } from "react-native-elements";
import { Dialog, CheckBox } from "@rneui/themed";
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  Pressable,
  Alert
} from "react-native";
import * as FileSystem from "expo-file-system";

const EXPENSES_FILE_URI = FileSystem.documentDirectory + "expenses.json";

const AddExpense = () => {
  const [enteredItem, setEnteredItem] = useState("");
  const [enteredPrice, setEnteredPrice] = useState(0);
  const [enteredCategory, setCategory] = useState("Others");
  const [ExpenseItems, setExpenseItems] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(0);

  const handleTitleInput = (enteredValue) => {
    setEnteredItem(enteredValue);
  };

  const handlePriceInput = (enteredValue) => {
    setEnteredPrice(enteredValue);
  };

  const handleCategoryInput = (enteredCategory) => {
    setCategory(enteredCategory);
  };

  const addExpenseHandler = async () => {
    const date = new Date();
    const Expense = {
      id: currentId,
      date: date.toISOString().split('T')[0],
      ExpenseItems: [...ExpenseItems],
    };
  
    try {
      const existingExpensesContent = await FileSystem.readAsStringAsync(
        EXPENSES_FILE_URI
      );
      const existingExpenses = existingExpensesContent
        ? JSON.parse(existingExpensesContent)
        : [];
  
      // Add the new expense to the existing list
      const updatedExpenses = [...existingExpenses, Expense];
  
      // Write the updated list back to the file
      await FileSystem.writeAsStringAsync(
        EXPENSES_FILE_URI,
        JSON.stringify(updatedExpenses)
      );

      Alert.alert(
        'Save Expense',
        'The expenses have been saved successfully.'
      );
    } catch (ex) {
      console.log("Error Occurred: " + ex);
      Alert.alert("Error","Error Occured When adding transaction")
    }
    setCurrentId(currentId+1);
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
    Alert.alert(
      'Add Expense',
      'The expenses have been Added successfully.'
    );
    setEnteredItem("");
    setEnteredPrice(0);
    setCategory("Others");
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
            ].map((l, i) => (
              <CheckBox
                key={i}
                title={l}
                containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checked === i + 1}
                onPress={() => {
                  setCategory(l);
                  setChecked(i + 1);
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
            value={enteredPrice}
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
            onPress={addExpenseHandler}
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
    backgroundColor: "#5372cf",
    borderWidth: 0.5,
    borderColor: "black",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    elevation: 10,
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
