import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";

const Header = (props) => {
  const [budget, setBudget] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const expense = props.addExpense;
  const balance = budget - expense;

  // Function to handle budget update
  const handleBudgetUpdate = (newBudget) => {
    setBudget(newBudget);
  };

  useEffect(() => {
    if (budget === 0) {
      setIsModalVisible(true);
    }
  }, [budget]);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSetBudget = () => {
    setIsModalVisible(false);
  };

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Budget</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              onChangeText={(text) => handleBudgetUpdate(text)}
              value={budget.toString()}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSetBudget}
            >
              <Text style={styles.modalButtonText}>Set Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    width: 75,
  },
  modalButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Header;
