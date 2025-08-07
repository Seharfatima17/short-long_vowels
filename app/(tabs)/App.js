import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Screen for ShortA
function ShortA({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Short 'A' Sound</Text>
      <Text style={styles.subtext}>This is the page for learning words with short 'a' sound.</Text>
      <Button 
        title="Go Back" 
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
}

// Home Screen
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Dyslexia App</Text>
      <Text style={styles.subtext}>A simple and friendly app for learning.</Text>
      <Button 
        title="Start Game" 
        onPress={() => navigation.navigate('short(a)')} 
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ShortA" component={ShortA} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  subtext: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center'
  }
});