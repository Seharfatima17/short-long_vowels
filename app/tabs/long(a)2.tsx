import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

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
      Speech.speak(word, {
        rate: 0.9,
        language: 'en',
      });
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
      speakFeedback("🎉 Excellent! You found all the long A sound words!");
    }
  }, [selectedWords]);

  const handleNext = () => {
    if (selectedWords.length === 0) {
      speakFeedback("You did not select any word.");
      return;
    }
    setShowScore(true);
  };

  const handleTryAgain = () => {
    setSelectedWords([]);
    setIncorrectSelections([]);
    setShowSuccess(false);
    setShowScore(false);
  };

  const handleGoNext = () => {
    router.push('/short(e)');
  };

  const getCardStyle = (word: string, isLongA: boolean) => {
    if (incorrectSelections.includes(word)) return styles.incorrectWordCard;
    if (selectedWords.includes(word)) return isLongA ? styles.correctWordCard : null;
    return null;
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/long(a)1')}
      >
        <Ionicons name="arrow-back" size={28} color="#2a52be" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title}>Find Long A Sound Words</ThemedText>
        <ThemedText style={styles.subtitle}>
          Tap to select words with the long A sound (ā)
        </ThemedText>

        {showSuccess && (
          <View style={styles.successContainer}>
            <ThemedText style={styles.successText}>🎉 Excellent Work! 🎉</ThemedText>
            <ThemedText style={styles.successSubtext}>
              You found all the long A sound words!
            </ThemedText>
          </View>
        )}

        <View style={styles.wordSelectionGrid}>
          {shuffledWords.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.wordSelectionCard,
                getCardStyle(item.word, item.isLongA),
                selectedWords.includes(item.word) && styles.selectedWordCard,
              ]}
              onPress={() => {
                speakWord(item.word);
                handleWordSelect(item.word);
              }}
            >
              <ThemedText style={styles.wordSelectionText}>{item.word}</ThemedText>
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
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 1,
    zIndex: 1,
    padding: 10,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2a52be',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  successContainer: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    alignItems: 'center',
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00acc1',
    textAlign: 'center',
    marginBottom: 5,
  },
  successSubtext: {
    fontSize: 18,
    color: '#00838f',
    textAlign: 'center',
  },
  wordSelectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  wordSelectionCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 12,
    margin: 6,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordSelectionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectedWordCard: {
    transform: [{ scale: 1.05 }],
  },
  correctWordCard: {
    backgroundColor: '#d4ffd6',
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  incorrectWordCard: {
    backgroundColor: '#ffd4d4',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#2a52be',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreBox: {
    marginTop: 30,
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
