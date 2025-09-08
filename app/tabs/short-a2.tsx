import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';

export default function ASoundActivity() {
  const navigation = useNavigation();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Enhanced word list with more 'A' words
  const items = [
    { name: 'apple', color: '#FF5252' },
    { name: 'ant', color: '#424242' },
    { name: 'axe', color: '#4CAF50' },
    { name: 'astronaut', color: '#2196F3' },
    { name: 'animal', color: '#FF9800' },
    { name: 'acorn', color: '#795548' },
    { name: 'anchor', color: '#607D8B' },
    { name: 'angel', color: '#E91E63' },
    { name: 'apron', color: '#9C27B0' },
    { name: 'arrow', color: '#F44336' },
    { name: 'artist', color: '#00BCD4' },
    { name: 'avocado', color: '#8BC34A' },
  ];

  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const currentVowelIndex = 0; // 'A' is first vowel
  const nextVowel = vowels[currentVowelIndex + 1] || vowels[0]; // Loop back to 'A' if at end

  async function speakWord(word: string) {
    try {
      setIsSpeaking(true);
      setActiveItem(word);
      await Speech.stop();
      await Speech.speak(word, {
        rate: 0.9,
        language: 'en',
        onDone: () => {
          setActiveItem(null);
          setIsSpeaking(false);
        },
        onError: () => {
          setActiveItem(null);
          setIsSpeaking(false);
        }
      });
    } catch (error) {
      console.error('Error speaking:', error);
      setActiveItem(null);
      setIsSpeaking(false);
    }
  }

  useEffect(() => {
    return () => Speech.stop();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title}>A Sound Treasure Hunt</ThemedText>
        <ThemedText style={styles.subtitle}>
          Tap items to hear their sounds!
        </ThemedText>
        
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                { backgroundColor: item.color },
                activeItem === item.name && styles.activeItem
              ]}
              onPress={() => speakWord(item.name)}
              disabled={isSpeaking}
              accessibilityLabel={`Tap to hear ${item.name}`}
            >
              <ThemedText style={[
                styles.itemText,
                { color: getContrastColor(item.color) }
              ]}>
                {item.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navContainer}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("short-a1")} // Goes back to LetterActivityScreen
          accessibilityLabel="Go back to letter activities"
        >
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]}
          onPress={() => navigation.navigate("long-a")} // Navigates to next vowel
          accessibilityLabel={`Go to ${nextVowel} vowel activities`}
        >
          <Text style={styles.navText}>Long Sound</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

// Helper function for accessible text color contrast
function getContrastColor(hexColor: string) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 120, // Extra space for navigation buttons
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: '#2a52be',
    letterSpacing: 0.5,
    lineHeight:35,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#424242',
    lineHeight: 30,
    letterSpacing: 0.3,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  item: {
    width: 140,
    height: 140,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    opacity: 1,
  },
  activeItem: {
    transform: [{ scale: 1.1 }],
    opacity: 1,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  itemText: {
    fontSize: 25,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'System',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  navContainer: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 14,
    backgroundColor: '#2a52be',
    borderRadius: 14,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#4CAF50', // Green color for next button
  },
  navText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});