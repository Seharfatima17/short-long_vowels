import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveScore } from '../firebase/firebasehelper';

export default function ShortUActivity() {
  const navigation = useNavigation();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // 8 short U words and 7 normal words
  const words = [
    { word: 'sun', isShortU: true },
    { word: 'dog', isShortU: false },
    { word: 'hug', isShortU: true },
    { word: 'cut', isShortU: true },
    { word: 'fun', isShortU: true },
    { word: 'cat', isShortU: false },
    { word: 'pen', isShortU: false },
    { word: 'bus', isShortU: true },
    { word: 'hat', isShortU: false },
    { word: 'leg', isShortU: false },
    { word: 'cup', isShortU: true },
    { word: 'sit', isShortU: false },
    { word: 'mud', isShortU: true },
    { word: 'red', isShortU: false },
    { word: 'jug', isShortU: true }
  ];

  const toggleWordSelection = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 8) { // Limit to 8 selections
      setSelectedWords([...selectedWords, word]);
    }
  };

  const speakWord = async (word: string) => {
    try {
      setIsSpeaking(true);
      await Speech.stop();
      await Speech.speak(word, {
        rate: 1.1,
        language: 'en-US',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false)
      });
    } catch (error) {
      console.error('Error speaking:', error);
      setIsSpeaking(false);
    }
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    return selectedWords.filter(word => 
      words.find(w => w.word === word)?.isShortU
    ).length;
  };

  const resetActivity = () => {
    setSelectedWords([]);
    setShowResults(false);
  };

  const goToNextActivity = async () => {
    const score = calculateScore();
    const total = 8;
    
    // Convert selectedWords array to an object with indices
    const selectedWordsObj: Record<number, string> = {};
    selectedWords.forEach((word, index) => {
      selectedWordsObj[index] = word;
    });
    
    try {
      await saveScore("short", "u", score, total, selectedWordsObj);
      navigation.navigate('long-u');
    } catch (error) {
      console.error("Failed to save score:", error);
      // Optionally show an error message to the user
      navigation.navigate('long-u'); // Still navigate even if save fails
    }
  };

  const goBack = () => {
    navigation.replace('short-u1');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button with Arrow Icon */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={goBack}
        accessibilityLabel="Go back to short U activities"
      >
        <Ionicons name="arrow-back" size={28} color="#2a52be" />
      </TouchableOpacity>

      {/* Activity Title */}
      <ThemedText style={styles.title}>Short U Activity</ThemedText>
      <ThemedText style={styles.subtitle}>
        Select up to 8 words with the short U sound
      </ThemedText>
      <ThemedText style={styles.selectionCount}>
        Selected: {selectedWords.length}/8
      </ThemedText>

      {/* Word Circles */}
      <View style={styles.wordContainer}>
        {words.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.wordCircle,
              selectedWords.includes(item.word) && styles.selectedWordCircle,
              selectedWords.includes(item.word) && item.isShortU && styles.correctSelection,
              selectedWords.includes(item.word) && !item.isShortU && styles.incorrectSelection
            ]}
            onPress={() => {
              toggleWordSelection(item.word);
              speakWord(item.word);
            }}
            disabled={isSpeaking || (selectedWords.length >= 8 && !selectedWords.includes(item.word))}
          >
            <ThemedText style={styles.wordText}>{item.word}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Check Answers Button */}
      <TouchableOpacity
        style={[styles.nextButton, selectedWords.length < 8 && styles.disabledButton]}
        onPress={checkAnswers}
        disabled={selectedWords.length < 8}
      >
        <ThemedText style={styles.nextButtonText}>Check Answers</ThemedText>
      </TouchableOpacity>

      {/* Results Modal */}
      <Modal visible={showResults} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Results</ThemedText>
            <ThemedText style={styles.modalText}>
              You selected {calculateScore()} out of 8 correct short U words!
            </ThemedText>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                onPress={resetActivity}
              >
                <ThemedText style={styles.modalButtonText}>Try Again</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#2a52be' }]}
                onPress={goToNextActivity}
              >
                <ThemedText style={styles.modalButtonText}>Next Activity</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2a52be',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
    textAlign: 'center',
  },
  selectionCount: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
  },
  wordCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  selectedWordCircle: {
    backgroundColor: '#FFD700', // Gold for selected
  },
  correctSelection: {
    backgroundColor: '#4CAF50', // Green for correct
  },
  incorrectSelection: {
    backgroundColor: '#FF5733', // Red for incorrect
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#2a52be',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2a52be',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});