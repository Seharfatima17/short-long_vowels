import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

export default function LongASoundActivity() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Long vowel A words with different colors
  const items = [
    { name: 'ape', color: '#FF6B6B' },
    { name: 'age', color: '#4ECDC4' },
    { name: 'aim', color: '#FFD166' },
    { name: 'ate', color: '#06D6A0' },
    { name: 'ace', color: '#118AB2' },
    { name: 'ale', color: '#073B4C' },
    { name: 'ate', color: '#EF476F' },
    { name: 'aid', color: '#FFC43D' },
    { name: 'ail', color: '#1B9AAA' },
    { name: 'air', color: '#F18F01' },
    { name: 'ark', color: '#99C24D' },
    { name: 'ate', color: '#2F4858' },
  ];

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

  // Fixed navigation function
  const handleNextPress = () => {
    router.push('/long(a)2'); // Using push instead of replace
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button - Top Left */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/long(a)')}
      >
        <Ionicons name="arrow-back" size={28} color="#2a52be" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title}>Long A Sound Treasure Hunt</ThemedText>
        <ThemedText style={styles.subtitle}>
          Tap items to hear words with the long A sound (ā)
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
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNextPress} // Using the fixed navigation function
          accessibilityLabel="Go to next activity"
        >
          <Text style={styles.navText}>Next Activity</Text>
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2a52be',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 30,
    color: '#424242',
    lineHeight: 30,
    letterSpacing: 0.3,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  item: {
    width: 160,
    height: 160,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    opacity: 0.9,
  },
  activeItem: {
    transform: [{ scale: 1.1 }],
    opacity: 1,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  itemText: {
    fontSize: 28,
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
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  navButton: {
    padding: 14,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#2a52be',
  },
  navText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});