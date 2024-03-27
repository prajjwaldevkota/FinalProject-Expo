import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import * as FileSystem from 'expo-file-system';

const EXPENSES_FILE_URI = FileSystem.documentDirectory + "expenses.json";

const Report = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    loadExpenseData();
    const interval = setInterval(loadExpenseData, 10000);
    return () => clearInterval(interval);
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
      expense.ExpenseItems.forEach((item) => {
        categoryTotal[item.category] = (categoryTotal[item.category] || 0) + parseFloat(item.price);
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

  const getRandomColor = (index) => {
    const colors = ["#FF6E40", "#FFD740", "#4CAF50", "#2196F3", "#9C27B0", "#FFC107", "#607D8B"];
    return colors[index % colors.length];
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Expense Report</Text>
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
    </View>
  );
};

export default Report;
