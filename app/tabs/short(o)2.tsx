import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const quizData = [
  { word: 'pot', options: ['pet', 'pat', 'pot'] },
  { word: 'dog', options: ['dig', 'dug', 'dog'] },
  { word: 'log', options: ['leg', 'log', 'lag'] },
  { word: 'top', options: ['tap', 'tip', 'top'] },
  { word: 'hop', options: ['hip', 'hop', 'hope'] },
];

export default function ShortOQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const router = useRouter();

  const currentQuestion = quizData[currentIndex];

  const speakWord = (word: string) => {
    setIsSpeaking(true);
    Speech.speak(word, {
      language: 'en-US',
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
    });
  };

  const handleOptionPress = (option: string) => {
    if (isCorrect === true) return;

    setSelected(option);
    const correct = currentQuestion.word;

    if (option === correct) {
      setIsCorrect(true);
      Speech.speak("Great job! That’s the short O sound.");
    } else {
      setIsCorrect(false);
      Speech.speak("Try again.");
    }
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      Speech.speak("Fantastic! You completed the quiz like a star! 🌟");
      Alert.alert(
        "🏆 Well Done!",
        "You’ve completed the Short O quiz!\nYou're a phonics superstar!",
        [{ text: "OK", onPress: () => router.push('/long(o)') }]
      );
    }
  };

  const getOptionStyle = (option: string) => {
    if (isCorrect !== true) return styles.optionButton;

    if (option === currentQuestion.word) {
      return [styles.optionButton, styles.correctOption];
    }

    return [styles.optionButton, styles.incorrectOption];
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/short(o)1')}>
        <Ionicons name="arrow-back" size={28} color="#2a52be" />
      </TouchableOpacity>

      <Text style={styles.title}>Find the Short O Word</Text>

      <Text style={styles.instruction}>Tap 🔊 then select the word you hear</Text>

      <TouchableOpacity
        style={styles.speakButton}
        onPress={() => speakWord(currentQuestion.word)}
        disabled={isSpeaking}
      >
        <Text style={styles.speakButtonText}>
          {isSpeaking ? 'Playing...' : '🔊 Play Sound'}
        </Text>
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => handleOptionPress(option)}
            disabled={isCorrect === true}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Always show Next button */}
      <TouchableOpacity
        style={[styles.nextButton, isCorrect !== true && styles.disabledNext]}
        onPress={handleNext}
        disabled={isCorrect !== true}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Text>
      </TouchableOpacity>

      {/* Always show Bottom Link */}
      <TouchableOpacity style={styles.bottomNext} onPress={() => router.push('/long(o)')}>
        <Text style={styles.bottomNextText}>Go to Long O</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#F7F9FC',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a52be',
    textAlign: 'center',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  speakButton: {
    backgroundColor: '#4a90e2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  speakButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 10,
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#e0f0ff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#c8f7c5',
  },
  incorrectOption: {
    backgroundColor: '#ffd6d6',
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2a52be',
    marginTop: 30,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledNext: {
    backgroundColor: '#a8bcd9',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNext: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
  },
  bottomNextText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
