import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { saveScore } from '../firebase/firebasehelper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define navigation types
type RootStackParamList = {
  'short(a)': undefined;
  'short-a1': undefined;
  'short-a2': undefined;
  // Add other screens as needed
};

type RouteParams = {
  letter?: string | string[];
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LetterActivityScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const params = route.params as RouteParams;
  const letter = params?.letter || 'a';
  const letterString = Array.isArray(letter) ? letter[0] : letter;
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [incorrectSelection, setIncorrectSelection] = useState<string | null>(null);
  const [showScore, setShowScore] = useState(false);

  type WordItem = { word: string; containsLetter: boolean };

  const wordData: WordItem[] = [
    { word: 'ant', containsLetter: true },
    { word: 'ball', containsLetter: true },
    { word: 'dog', containsLetter: false },
    { word: 'apple', containsLetter: true },
    { word: 'pen', containsLetter: false },
    { word: 'cat', containsLetter: true },
    { word: 'book', containsLetter: false },
    { word: 'rat', containsLetter: true },
    { word: 'mat', containsLetter: true },
    { word: 'mall', containsLetter: true },
    { word: 'pig', containsLetter: false },
    { word: 'act', containsLetter: true },
    { word: 'hen', containsLetter: false },
    { word: 'bat', containsLetter: true },
    { word: 'hook', containsLetter: false },
    { word: 'hat', containsLetter: true },
  ];

  const speakWord = (text: string) => {
    Speech.speak(text, { language: 'en-US', rate: 0.9 });
  };

  const handleWordSelect = (word: string) => {
    speakWord(word);
    const wordItem = wordData.find(item => item.word === word);
    if (!wordItem) return;

    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      return;
    }

    if (!wordItem.containsLetter) {
      setIncorrectSelection(word);
      setTimeout(() => setIncorrectSelection(null), 1000);
    }

    setSelectedWords(prev => [...prev, word]);
  };

  const correctWords = wordData.filter(item => item.containsLetter).map(item => item.word);
  const score = selectedWords.filter(word => correctWords.includes(word)).length;

  const handleNextActivity = () => {
    if (selectedWords.length === 0) {
      // If no words selected, go directly to next page
      navigation.navigate('short-a2');
    } else {
      // If words are selected, show score screen
      setShowScore(true);
    }
  };

  const handleGoNext = async () => {
    try {
      const saved = await saveScore(
        "short",
        "A",
        score,
        correctWords.length,
        selectedWords
      );
      
      if (saved) {
        console.log("Score saved successfully, navigating...");
        navigation.navigate('short-a2');
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert(
        "Error", 
        "Score could not be saved. Please check your internet connection and try again.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  };

  const handleTryAgain = () => {
    setSelectedWords([]);
    setShowSuccess(false);
    setShowScore(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('short(a)')}>
        <Ionicons name="arrow-back" size={28} color="#2a52be" />
      </TouchableOpacity>

      <Text style={styles.title}>Find Words with: {letterString.toUpperCase()}</Text>
      <Text style={styles.instructions}>
        Tap on words that contain the letter "{letterString}"
      </Text>

      {showSuccess && (
        <Text style={styles.successMessage}>
          Excellent! You found all words with {letterString.toUpperCase()}!
        </Text>
      )}

      <View style={styles.wordGrid}>
        {wordData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.wordCard,
              selectedWords.includes(item.word) &&
                (item.containsLetter ? styles.correctWord : styles.incorrectWord),
            ]}
            onPress={() => handleWordSelect(item.word)}
            activeOpacity={1}
          >
            <Text style={styles.wordText}>{item.word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showScore && (
        <View style={styles.scoreBox}>
          <Text style={styles.score}>
            ✅ Correct: {score} / {correctWords.length}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.tryButton} onPress={handleTryAgain}>
              <Text style={styles.tryText}>🔁 Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goNextButton} onPress={handleGoNext}>
              <Text style={styles.goNextText}>⏭️ Go Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!showScore && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextActivity}>
          <Text style={styles.nextButtonText}>Next Activity</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    justifyContent: 'flex-start',
    backgroundColor: '#fff', // Added background color
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 5,
    zIndex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2a52be',
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 6,
  },
  wordCard: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Added text color
  },
  correctWord: {
    backgroundColor: '#d4ffd6',
    borderColor: '#2ecc71',
  },
  incorrectWord: {
    backgroundColor: '#ffd4d4',
    borderColor: '#e74c3c',
  },
  successMessage: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    color: '#00acc1',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2a52be',
    padding: 15,
    borderRadius: 19,
    alignItems: 'center',
    marginTop: 17,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  tryButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  tryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  goNextButton: {
    backgroundColor: '#2a52be',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  goNextText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});