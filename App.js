import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import ExpenseScreen from "./Screens/Expenses";
import ReportScreen from "./Screens/Report";
import SettingScreen from "./Screens/Setting";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Define Stack Navigator for each tab
const ExpenseStack = createStackNavigator();
const ReportStack = createStackNavigator();
const SettingStack = createStackNavigator();

const ExpenseStackScreen = () => (
  <ExpenseStack.Navigator>
    <ExpenseStack.Screen name="Expense" component={ExpenseScreen} options={{ headerShown: false }}/>
  </ExpenseStack.Navigator>
);

const ReportStackScreen = () => (
  <ReportStack.Navigator>
    <ReportStack.Screen name="Report" component={ReportScreen} options={{ headerShown: false }}/>
  </ReportStack.Navigator>
);

const SettingStackScreen = () => (
  <SettingStack.Navigator>
    <SettingStack.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }}/>
  </SettingStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Expense" component={ExpenseStackScreen} />
        <Tab.Screen name="Report" component={ReportStackScreen} />
        <Tab.Screen name="Setting" component={SettingStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
