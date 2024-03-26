import React, { useState } from "react";
import { Input } from "react-native-elements";
import { Dialog, CheckBox } from "@rneui/themed";
import {
  StyleSheet,
  ImageBackground,
  Modal,
  Text,
  View,
  Pressable,
} from "react-native";
import * as FileSystem from "expo-file-system";

const EXPENSES_FILE_URI = FileSystem.documentDirectory + "expenses.json";

const AddExppense = (props) => {
  const [enteredItem, setEnteredItem] = useState("");
  const [enteredPrice, setEnteredPrice] = useState(0);
  const [enteredCategory, setCategory] = useState("Others");
  const [transactionItems, setTransactionItems] = useState([]);
  const [currentId, setCurrentId] = useState(9);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(0);

  function handleTitleInput(enteredValue) {
    setEnteredItem(enteredValue);
  }

  function handlePriceInput(enteredValue) {
    setEnteredPrice(enteredValue);
  }

  function handleCategoryInput(enteredCategory) {
    setCategory(enteredCategory);
  }

  function addTransactionHandler() {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const min = new Date().getMinutes();
    const transaction = {
      id: currentId,
      addDate: date + "-" + "Nov",
      addTime: hours + ":" + min,
      transactionItems: transactionItems,
    };
    FileSystem.readAsStringAsync(EXPENSES_FILE_URI)
      .then((result) => {
        const existingTransactions = JSON.parse(result) || [];
        const updatedTransactions = [...existingTransactions, transaction];
        return FileSystem.writeAsStringAsync(
          EXPENSES_FILE_URI,
          JSON.stringify(updatedTransactions)
        );
      })
      .then(() => {
        props.onAddTransaction(transaction);
        setCurrentId(currentId + 1);
        setTransactionItems([]);
        props.onCancel();
      })
      .catch((error) => console.error("Error:", error));
  }

  function addTransactionItemHandler() {
    setTransactionItems((currentTransactionItems) => [
      ...currentTransactionItems,
      {
        title: enteredItem,
        price: enteredPrice,
        category: enteredCategory,
      },
    ]);
    setEnteredItem("");
    setEnteredPrice(0);
    setCategory("Others");
  }

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
                      handleCategoryInput;
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
            <Pressable onPress={addTransactionItemHandler} style={styles.primaryButton}>
              <Text style={styles.buttonText}> Add Transaction </Text>
            </Pressable>
            <Pressable onPress={addTransactionHandler} style={styles.primaryButton}>
              <Text style={styles.buttonText}> Done </Text>
            </Pressable>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default AddExppense;