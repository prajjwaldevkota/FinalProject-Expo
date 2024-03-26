import React, { useEffect, useRef } from 'react';
import { View, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

const EXPENSES_FILE_URI = FileSystem.documentDirectory + 'expenses.json';

const Setting = ({ navigation }) => {
  const soundObject = useRef(new Audio.Sound()).current;

  useEffect(() => {
    const loadSound = async () => {
      try {
        await soundObject.loadAsync(require('../assets/notification.mp3'));
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };

    loadSound();
    return () => {
      soundObject.unloadAsync();
    };
  }, []);

  const deleteExpenses = async () => {
    try {
      await FileSystem.writeAsStringAsync(EXPENSES_FILE_URI, '[]');
      await soundObject.replayAsync();

      Alert.alert(
        'Expenses Deleted',
        'The expenses have been cleared successfully.'
      );
    } catch (error) {
      console.error('Error deleting expenses:', error);
      Alert.alert(
        'Error',
        'An error occurred while deleting expenses. Please try again later.'
      );
    }
  };

  return (
    <View>
      <Button title="Delete Expenses" onPress={deleteExpenses} />
    </View>
  );
};

export default Setting;
