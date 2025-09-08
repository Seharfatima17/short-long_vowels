import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LongUActivityScreen() {
  const navigation = useNavigation();

  const vowelData = {
    letter: 'u',
    //sound: 'yoo',
    soundDescription: 'Long U sound (as in cube)',
    examples: ['cube', 'mule', 'tune', 'huge', 'fuse', 'use', 'cute'],
    practiceWords: ['flute', 'prune', 'brute', 'dune', 'june']
  };

  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (text) => {
    if (isSpeaking) {
      await Speech.stop();
    }
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.5,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false)
    });
  };

  const playLongUSound = () => {
    speak('yoo, yoo, yoo');
  };

  const navigateToLetterActivityScreen = () => {
    navigation.navigate('long-u1');
  };

  const navigateBack = () => {
    navigation.navigate('short-u2');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={navigateBack}
      >
        <Ionicons name="arrow-back" size={28} color="#2a52be" />
      </TouchableOpacity>

      {/* Vowel Introduction */}
      <View style={styles.section}>
        <ThemedText style={styles.title}>Long Vowel Sound</ThemedText>
        <View style={styles.letterCard}>
          <ThemedText style={styles.letter}>{vowelData.letter}</ThemedText>
          <ThemedText style={styles.sound}>{vowelData.sound}</ThemedText>
        </View>
        <ThemedText style={styles.description}>
          {vowelData.soundDescription}
        </ThemedText>

        <TouchableOpacity
          style={styles.soundButton}
          onPress={playLongUSound}
          disabled={isSpeaking}
        >
          <ThemedText style={styles.buttonText}>
            {isSpeaking ? 'Playing...' : 'Pronunciation of Long U'}
          </ThemedText>
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 70,
    margin: 10,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 3,
    zIndex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 9,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#2a52be',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#4a90e2',
    marginLeft: 10,
  },
  letterCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginVertical: 5,
  },
  letter: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#2a52be',
    marginRight: 1,
    marginBottom: 5,
    lineHeight: 47,
  },
  sound: {
    fontSize: 40,
    color: '#4a90e2',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 16,
  },
  soundButton: {
    backgroundColor: '#4a90e2',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 22,
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
    padding: 10,
    borderRadius: 10,
    margin: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  wordText: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  practiceWordCard: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  practiceWordText: {
    fontSize: 19,
  },
  nextButton: {
    backgroundColor: '#2a52be',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
    marginTop: 15,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});