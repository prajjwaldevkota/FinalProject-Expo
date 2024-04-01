import * as FileSystem from "expo-file-system";

const EXPENSES_FILE_URI = FileSystem.documentDirectory + "expenses.json";

export const readExpensesFromFile = async () => {
  try {
    const { exists } = await FileSystem.getInfoAsync(EXPENSES_FILE_URI);
    if (!exists) {
      // If the file doesn't exist, create it with an empty array
      await FileSystem.writeAsStringAsync(EXPENSES_FILE_URI, "[]");
    }
    if (exists) {
      const expensesContent = await FileSystem.readAsStringAsync(
        EXPENSES_FILE_URI
      );
      return JSON.parse(expensesContent);
    }
    return [];
  } catch (error) {
    console.error("Error reading expenses from file:", error);
    return [];
  }
};

export const writeExpensesToFile = async (expenses) => {
  try {
    await FileSystem.writeAsStringAsync(
      EXPENSES_FILE_URI,
      JSON.stringify(expenses)
    );
    console.log("Expenses written to file successfully.");
  } catch (error) {
    console.error("Error writing expenses to file:", error);
  }
};
