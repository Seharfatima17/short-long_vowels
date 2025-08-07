import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LongVowelAActivity() {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const vowelData = {
    letter: 'a',
    sound: 'ā',
    soundDescription: 'Long A sound (as in cake)',
    examples: ['cake', 'ape', 'bake', 'name', 'game', 'tape', 'lake'],
    practiceWords: ['rain', 'day', 'play', 'stay', 'may'],
  };

  const speak = async (text) => {
    if (isSpeaking) await Speech.stop();
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.7,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const playSoundThreeTimes = () => {
    speak(`a....a....a....`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/short(a)2')}>
          <Ionicons name="arrow-back" size={24} color="#2a52be" />
        </TouchableOpacity>

        {/* Vowel Info */}
        <View style={styles.section}>
          <ThemedText style={styles.title}>Long Vowel Sound</ThemedText>
          <View style={styles.letterCard}>
            <ThemedText style={styles.letter}>{vowelData.letter}</ThemedText>
            <ThemedText style={styles.sound}>{vowelData.sound}</ThemedText>
          </View>
          <ThemedText style={styles.description}>{vowelData.soundDescription}</ThemedText>
          <TouchableOpacity
            style={styles.soundButton}
            onPress={playSoundThreeTimes}
            disabled={isSpeaking}
          >
            <ThemedText style={styles.buttonText}>
              {isSpeaking ? 'Playing...' : 'Hear Long A Sound'}
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
        <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/long(a)1')}>
          <ThemedText style={styles.nextButtonText}>Next Activity</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
  },
  section: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#2a52be',
  },
  letterCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  letter: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#2a52be',
    marginRight: 6,
  },
  sound: {
    fontSize: 36,
    color: '#4a90e2',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 12,
    marginTop: 5,
  },
  soundButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 90,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a90e2',
    marginBottom: 9,
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordCard: {
    backgroundColor: '#e9f5ff',
    padding: 10,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
    margin: 6,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  practiceWordCard: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 6,
    minWidth: 65,
    alignItems: 'center',
    margin: 5,
  },
  practiceWordText: {
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: '#2a52be',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    marginBottom: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
