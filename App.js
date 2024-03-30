import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Import your screens
import ExpenseScreen from "./Screens/Expenses";
import ReportScreen from "./Screens/Report";
import SettingScreen from "./Screens/Setting";
import AddExpenseScreen from "./Screens/AddExpense";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Define Stack Navigator for each tab
const ExpenseStack = createStackNavigator();
const ReportStack = createStackNavigator();
const SettingStack = createStackNavigator();
const AddExpenseStack = createStackNavigator();

const ExpenseStackScreen = () => (
  <ExpenseStack.Navigator>
    <ExpenseStack.Screen
      name="Expenses"
      component={ExpenseScreen}
      options={{ headerShown: false }}
    />
  </ExpenseStack.Navigator>
);

const ReportStackScreen = () => (
  <ReportStack.Navigator>
    <ReportStack.Screen
      name="Reports"
      component={ReportScreen}
      options={{ headerShown: false }}
    />
  </ReportStack.Navigator>
);

const SettingStackScreen = () => (
  <SettingStack.Navigator>
    <SettingStack.Screen
      name="Settings"
      component={SettingScreen}
      options={{ headerShown: false }}
    />
  </SettingStack.Navigator>
);

const AddExpenseStackScreen = () => (
  <AddExpenseStack.Navigator>
    <AddExpenseStack.Screen
      name="Expenses Adds"
      component={AddExpenseScreen}
      options={{ headerShown: false }}
    />
  </AddExpenseStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.header}>
        <Text style={styles.headerText}>P_devkota157405</Text>
      </View>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: 'green' }}>
        <Tab.Screen name="Expense" component={ExpenseStackScreen} options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="money" color={color} />,
        }}/>
        <Tab.Screen name="Report" component={ReportStackScreen}  options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="pie-chart" color={color} />,
        }}/>
        <Tab.Screen name="Add Expenses" component={AddExpenseStackScreen} options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="dollar" color={color} />,
        }}/>
        <Tab.Screen name="Setting" component={SettingStackScreen} options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    marginTop:5,
    marginBottom:-10,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },

});
