import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ShortEActivityScreen() {
  const router = useRouter();
  
  // Vowel data for dyslexic learners - updated for short E
  const vowelData = {
    letter: 'e',
    sound: 'eh', // Changed to short E sound
    soundDescription: 'Short E sound (as in bed)',
    examples: ['bed', 'red', 'pen', 'leg', 'net', 'wet', 'egg'],
    practiceWords: ['men', 'pet', 'jet', 'web', 'hen']
  };

  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (text) => {
    if (isSpeaking) {
      await Speech.stop();
    }
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false)
    });
  };

  // Updated to say the short E sound ("eh") three times
  const playSoundThreeTimes = () => {
    speak(`eh, eh, eh`); // Directly using the short E sound
  };

  const navigateToLetterActivityScreen = () => {
    router.push(`/short(e)1`);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/long(a)2')}
      >
        <Ionicons name="arrow-back" size={28} color="#2a52be" />
      </TouchableOpacity>
        
      {/* Vowel Introduction */}
      <View style={styles.section}>
        <ThemedText style={styles.title}>Short Vowel Sound</ThemedText>
        <View style={styles.letterCard}>
          <ThemedText style={styles.letter}>{vowelData.letter}</ThemedText>
          <ThemedText style={styles.sound}>eh</ThemedText> {/* Display short E sound */}
        </View>
        <ThemedText style={styles.description}>
          {vowelData.soundDescription}
        </ThemedText>

        <TouchableOpacity 
          style={styles.soundButton}
          onPress={playSoundThreeTimes}
          disabled={isSpeaking}
        >
          <ThemedText style={styles.buttonText}>
            {isSpeaking ? 'Playing...' : 'Pronounce Letter E'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Rest of the component remains the same */}
      {/* Example Words */}
      <View style={styles.section}>
        <ThemedText style={styles.subtitle}>Example Words:</ThemedText>
        <View style={styles.wordGrid}>
          {vowelData.examples.map((word, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.wordCard}
              onPress={() => speak(word)}
              disabled={isSpeaking}
            >
              <ThemedText style={styles.wordText}>{word}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Practice Words */}
      <View style={styles.section}>
        <ThemedText style={styles.subtitle}>Practice Reading:</ThemedText>
        <View style={styles.wordGrid}>
          {vowelData.practiceWords.map((word, index) => (
            <View key={index} style={styles.practiceWordCard}>
              <ThemedText style={styles.practiceWordText}>{word}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={navigateToLetterActivityScreen}
      >
        <ThemedText style={styles.nextButtonText}>Next Activity</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

// Styles remain exactly the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    paddingTop: 40,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2a52be',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    color: '#4a90e2',
  },
  letterCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginVertical: 15,
  },
  letter: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#2a52be',
    marginRight: 10,
  },
  sound: {
    fontSize: 50,
    color: '#4a90e2',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  soundButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordCard: {
    backgroundColor: '#e9f5ff',
    padding: 15,
    borderRadius: 8,
    margin: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  practiceWordCard: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 6,
    margin: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  practiceWordText: {
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: '#2a52be',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
    marginTop: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    fontSize: 40,
    color: '#2a52be',
    fontWeight: 'bold',
  },
});