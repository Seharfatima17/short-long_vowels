import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VowelActivityScreen from './short(a)';
import ShortA1Screen from './short-a1';
import ShortA2Screen from './short-a2';
import LongVowelAActivity from './long-a'; // Import the LongVowelAActivity screen
import HomeScreen from './homescreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="homescreen">
        <Stack.Screen 
          name="homescreen" 
          component={HomeScreen} 
          options={{ title: 'Home' }}
        />
        <Stack.Screen 
          name="short(a)" 
          component={VowelActivityScreen} 
          options={{ title: 'Short A Sound' }}
        />
        <Stack.Screen 
          name="short-a1" 
          component={ShortA1Screen} 
          options={{ title: 'Short A Activity' }}
        />
        <Stack.Screen 
          name="short-a2" 
          component={ShortA2Screen} 
          options={{ title: 'A Sound Treasure Hunt' }}
        />
        <Stack.Screen 
          name="long-a" 
          component={LongVowelAActivity} 
          options={{ title: 'Long A Sound' }}
        />
        <Stack.Screen 
          name="long-a1" 
          component={LongVowelAActivity} 
          options={{ title: 'Long A Activity' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}