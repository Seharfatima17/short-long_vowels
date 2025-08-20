import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { saveScore } from "../firebase/firebasehelper";

export default function LongASelectionActivity() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [incorrectSelections, setIncorrectSelections] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showScore, setShowScore] = useState(false);

  const allWords = [
    { word: 'ate', isLongA: true },
    { word: 'cat', isLongA: false },
    { word: 'ant', isLongA: false },
    { word: 'ape', isLongA: true },
    { word: 'hat', isLongA: false },
    { word: 'game', isLongA: true },
    { word: 'map', isLongA: false },
    { word: 'cake', isLongA: true },
    { word: 'rat', isLongA: false },
    { word: 'rain', isLongA: true },
    { word: 'pan', isLongA: false },
    { word: 'day', isLongA: true },
  ];

  const [shuffledWords, setShuffledWords] = useState(() => shuffleArray([...allWords]));
  const correctWords = allWords.filter(item => item.isLongA).map(item => item.word);
  const score = selectedWords.filter(word => correctWords.includes(word)).length;

  function shuffleArray(array: any[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const speakWord = (word: string) => {
    try {
      Speech.stop();
      Speech.speak(word, { rate: 0.9, language: 'en' });
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const speakFeedback = (text: string) => {
    Speech.stop();
    Speech.speak(text, { rate: 0.8, language: 'en' });
  };

  const handleWordSelect = (word: string) => {
    const isCorrect = allWords.find(item => item.word === word)?.isLongA;
    const isSelected = selectedWords.includes(word);

    if (isSelected) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      setIncorrectSelections(prev => prev.filter(w => w !== word));
    } else {
      setSelectedWords(prev => [...prev, word]);
      if (!isCorrect) {
        setIncorrectSelections(prev => [...prev, word]);
        setTimeout(() => {
          setSelectedWords(prev => prev.filter(w => w !== word));
          setIncorrectSelections(prev => prev.filter(w => w !== word));
        }, 1000);
      }
    }
  };

  useEffect(() => {
    const allCorrect = correctWords.every(word => selectedWords.includes(word)) &&
      selectedWords.length === correctWords.length;
    if (allCorrect && !showSuccess) {
      setShowSuccess(true);
      speakFeedback("Excellent! You found all the long A sound words!");
    }
  }, [selectedWords]);

  const handleNext = () => {
    if (selectedWords.length === 0) {
      // If no words selected, go directly to next page
      router.push('/tabs/homescreen');
    } else {
      // If words are selected, show score screen
      setShowScore(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedWords([]);
    setIncorrectSelections([]);
    setShowSuccess(false);
    setShowScore(false);
    setShuffledWords(shuffleArray([...allWords]));
  };

  const handleGoNext = async () => {
    try {
      await saveScore(
        "long",
        "A",
        score,
        correctWords.length,
        selectedWords
      );
      router.push('/tabs/homescreen');
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const getCardStyle = (word: string, isLongA: boolean) => {
    if (incorrectSelections.includes(word)) return styles.incorrectWord;
    if (selectedWords.includes(word)) return isLongA ? styles.correctWord : null;
    return null;
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.push('/tabs/long-a1')}
      >
        <Ionicons name="arrow-back" size={24} color="#2a52be" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title}>Find Long A Sound Words</ThemedText>
        <ThemedText style={styles.instructions}>
          Tap on words that contain the long A sound 
        </ThemedText>

        {showSuccess && (
          <ThemedText style={styles.successMessage}>
            Excellent! You found all words with long A sound!
          </ThemedText>
        )}

        <View style={styles.wordGrid}>
          {shuffledWords.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.wordCard,
                getCardStyle(item.word, item.isLongA),
              ]}
              onPress={() => {
                speakWord(item.word);
                handleWordSelect(item.word);
              }}
              activeOpacity={1}
            >
              <ThemedText style={styles.wordText}>{item.word}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {showScore && (
          <View style={styles.scoreBox}>
            <ThemedText style={styles.score}>
              ✅ Correct: {score} / {correctWords.length}
            </ThemedText>
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
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next Activity</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    justifyContent: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 5,
    zIndex: 1,
    padding: 10,
  },
  scrollContainer: {
    paddingBottom: 120,
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
    marginBottom: 20,
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