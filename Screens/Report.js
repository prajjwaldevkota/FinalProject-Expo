import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { PieChart } from "react-native-chart-kit";
import * as FileSystem from "expo-file-system";
import * as SMS from "expo-sms";
import * as MailComposer from "expo-mail-composer";
import { Audio } from "expo-av";

const EXPENSES_FILE_URI = FileSystem.documentDirectory + "expenses.json";

const Report = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [date, setDate] = useState();
  const soundObject = useRef(new Audio.Sound()).current;

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadExpenseData();
    }, 10);
    return () => {
      clearTimeout(timerId);
    };
  }, [categoryData]);

  useEffect(() => {
    const loadSound = async () => {
      try {
        await soundObject.loadAsync(require("../assets/sms.mp3"));
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    };

    loadSound();
    return () => {
      soundObject.unloadAsync();
    };
  }, []);

  const loadExpenseData = async () => {
    try {
      const { exists } = await FileSystem.getInfoAsync(EXPENSES_FILE_URI);
      if (exists) {
        const content = await FileSystem.readAsStringAsync(EXPENSES_FILE_URI);
        const expenses = JSON.parse(content) || [];
        const categoryTotal = calculateCategoryTotal(expenses);
        prepareDataForChart(categoryTotal);
      }
    } catch (error) {
      console.error("Error loading expense data:", error);
    }
  };

  const calculateCategoryTotal = (expenses) => {
    const categoryTotal = {};
    expenses.forEach((expense) => {
      setDate(expense.date);
      expense.ExpenseItems.forEach((item) => {
        categoryTotal[item.category] =
          (categoryTotal[item.category] || 0) + parseFloat(item.price);
      });
    });
    return categoryTotal;
  };

  const prepareDataForChart = (categoryTotal) => {
    const data = Object.keys(categoryTotal).map((category, index) => ({
      name: category,
      amount: categoryTotal[category],
      color: getRandomColor(index),
    }));
    setCategoryData(data);
  };

  const sendReportSMS = async () => {
    try {
      const smsContent = generateSMSContent(categoryData);
      await SMS.sendSMSAsync([], smsContent);
      await soundObject.replayAsync();
      Alert.alert("SMS", "SMS Sent Successfuly");
    } catch (error) {
      console.error("Error sending SMS:", error);
      Alert.alert("Error", "Failed to send SMS");
    }
  };

  const sendReportEmail = async () => {
    try {
      const emailContent = generateEmailContent(categoryData);
      await MailComposer.composeAsync({
        recipients: [],
        subject: "Expense Report",
        body: emailContent,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send email");
    }
  };

  const generateSMSContent = (categoryData) => {
    let smsContent = `Expense Report for ${date}:\n`;
    categoryData.forEach((category) => {
      smsContent += `${category.name}: ${category.amount}$\n`;
    });
    return smsContent;
  };

  const generateEmailContent = (categoryData) => {
    let emailContent = `Expense Report for ${date}:\n`;
    categoryData.forEach((category) => {
      emailContent += `${category.name}: ${category.amount}$\n`;
    });
    return emailContent;
  };

  const getRandomColor = (index) => {
    const colors = [
      "#FF6E40",
      "#FFD740",
      "#4CAF50",
      "#2196F3",
      "#9C27B0",
      "#FFC107",
      "#607D8B",
    ];
    return colors[index % colors.length];
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {categoryData.length > 0 && (
        <PieChart
          data={categoryData}
          width={300}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#1E2923",
            backgroundGradientTo: "#08130D",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      )}
      <View style={styles.buttonContainer}>
        <Pressable onPress={sendReportSMS} style={styles.button}>
          <Text style={styles.buttonText}>Send Report as SMS</Text>
        </Pressable>
        <Pressable onPress={sendReportEmail} style={styles.button}>
          <Text style={styles.buttonText}>Send Report as Email</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    margin: 5,
    padding: 10,
    backgroundColor: "#2F4E9C",
    borderWidth: 0.5,
    borderRadius: 50,
    borderColor: "white",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "400",
    color: "white",
  },
});

export default Report;
