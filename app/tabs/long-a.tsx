import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation types
type RootStackParamList = {
  'short-a2': undefined;
  'long-a1': undefined;
};

type LongVowelAActivityNavigationProp = StackNavigationProp<RootStackParamList>;

export default function LongVowelAActivity() {
  const navigation = useNavigation<LongVowelAActivityNavigationProp>();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const vowelData = {
    letter: 'a',
    sound: 'ā',
    soundDescription: 'Long A sound (as in cake)',
    examples: ['cake', 'cape', 'bake', 'name', 'game', 'tape', 'lake'],
    practiceWords: ['rain', 'day', 'play', 'stay', 'may'],
  };

  const speak = async (text: string) => {
    if (isSpeaking) await Speech.stop();
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.5,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false)
    });
  };

  const playSoundThreeTimes = () => {
    speak(`ā....ā....ā....`);
  };

  const navigateToLetterActivityScreen = () => {
    navigation.navigate('long-a1');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('short-a2')}
        >
          <Ionicons name="arrow-back" size={24} color="#2a52be" />
        </TouchableOpacity>

        {/* Vowel Introduction */}
        <View style={styles.section}>
          <Text style={styles.title}>Long Vowel Sound</Text>
          <View style={styles.letterCard}>
            <Text style={styles.letter}>{vowelData.letter}</Text>
            <Text style={styles.sound}>{vowelData.sound}</Text>
          </View>
          <Text style={styles.description}>
            {vowelData.soundDescription}
          </Text>

          <TouchableOpacity
            style={styles.soundButton}
            onPress={playSoundThreeTimes}
            disabled={isSpeaking}
          >
            <Text style={styles.buttonText}>
              {isSpeaking ? 'Playing...' : 'Pronunciation of Long A'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Example Words */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Example Words:</Text>
          <View style={styles.wordGrid}>
            {vowelData.examples.map((word, index) => (
              <TouchableOpacity
                key={index}
                style={styles.wordCard}
                onPress={() => speak(word)}
                disabled={isSpeaking}
              >
                <Text style={styles.wordText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Practice Words */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Practice Reading:</Text>
          <View style={styles.wordGrid}>
            {vowelData.practiceWords.map((word, index) => (
              <View key={index} style={styles.practiceWordCard}>
                <Text style={styles.practiceWordText}>{word}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={navigateToLetterActivityScreen}
        >
          <Text style={styles.nextButtonText}>Next Activity</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    top: 40,
    left: 7,
    zIndex: 1,
    padding: 8,
    backgroundColor: '#e9f5ff',
    borderRadius: 20,
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
    fontSize: 36,
    color: '#4a90e2',
    marginBottom: 10,
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