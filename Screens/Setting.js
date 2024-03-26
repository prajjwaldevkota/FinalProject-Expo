import { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { Audio }  from "expo-av";

const EXPENSES_FILE_URI = FileSystem.documentDirectory + "expenses.json";


const Setting = ({ navigation }) => {
  const [sound, setSound] = useState();
  const deleteExpenses = async () => {
    
    try {
      await FileSystem.writeAsStringAsync(EXPENSES_FILE_URI, '[]'); 
      const { sound } = await Audio.Sound.createAsync( require('../assets/notification.mp3'));
      Alert.alert("Expenses Deleted", "The expenses have been cleared successfully.");
      setSound(sound);
      await sound.playAsync();
      
    } catch (error) {
      console.error("Error deleting expenses:", error);
      Alert.alert("Error", "An error occurred while deleting expenses. Please try again later.");
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  
  return (
    <View>
      <Button title="Delete Expenses" onPress={deleteExpenses}/>
    </View>
  );
};

export default Setting;
