import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons'; // Back icon
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LongVowelEActivity() {
  const router = useRouter();

  const vowelData = {
    letter: 'e',
    sound: 'ē',
    soundDescription: 'Long E sound (as in tree)',
    examples: ['see', 'tree', 'be', 'he', 'me', 'free', 'feet'],
    practiceWords: ['read', 'need', 'green', 'keep', 'deep']
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

  const playSoundThreeTimes = () => {
    speak(`e....e....e....`);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/short(e)2')}
      >
        <Ionicons name="arrow-back" size={24} color="#2a52be" />
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
          onPress={playSoundThreeTimes}
          disabled={isSpeaking}
        >
          <ThemedText style={styles.buttonText}>
            {isSpeaking ? 'Playing...' : 'Hear Long E Sound'}
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
        onPress={() => router.push('/long(e)1')}
      >
        <ThemedText style={styles.nextButtonText}>Next Activity</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
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
    marginVertical: -1,
  },
  letter: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#2a52be',
    marginRight: 5,
  },
  sound: {
    fontSize: 50,
    color: '#4a90e2',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    marginTop:10,
    lineHeight: 26,
  },
  soundButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
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
    minWidth: 70,
    alignItems: 'center',
  },
  wordText: {
    fontSize: 18,
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
});
