import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OSoundActivity() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Words with short O sound
  const items = [
    { name: 'octopus', color: '#FFADAD' },
    { name: 'ostrich', color: '#FFD6A5' },
    { name: 'olive', color: '#FDFFB6' },
    { name: 'onion', color: '#CAFFBF' },
    { name: 'orange', color: '#9BF6FF' },
    { name: 'ox', color: '#A0C4FF' },
    { name: 'off', color: '#BDB2FF' },
    { name: 'odd', color: '#FFC6FF' },
    { name: 'onto', color: '#D0F4DE' },
    { name: 'object', color: '#CDE7BE' },
  ];

  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const currentVowelIndex = 3; // 'O' is the fourth vowel
  const nextVowel = vowels[currentVowelIndex + 1] || vowels[0];

  async function speakWord(word: string) {
    try {
      setIsSpeaking(true);
      setActiveItem(word);
      await Speech.stop();
      await Speech.speak(word, {
        rate: 1,
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
        <ThemedText style={styles.title}>O Sound Treasure Hunt</ThemedText>
        <ThemedText style={styles.subtitle}>
          Tap items to hear words with the short O sound (aw)
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
          onPress={() => router.replace('/short(o)')} // Adjust route as needed
        >
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]}
          onPress={() => router.push('/short(o)2')} // Adjust next activity route
        >
          <Text style={styles.navText}>Next Activity</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

// Helper for text contrast
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
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2a52be',
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 30,
    color: '#424242',
    lineHeight: 30,
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  navContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 14,
    backgroundColor: '#2a52be',
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  navText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
