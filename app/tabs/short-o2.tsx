import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { saveScore } from '../firebase/firebasehelper';

const quizData = [
  { word: 'pot', options: ['pet', 'pat', 'pot'] },
  { word: 'dog', options: ['dig', 'dug', 'dog'] },
  { word: 'log', options: ['leg', 'log', 'lag'] },
  { word: 'top', options: ['tap', 'tip', 'top'] },
  { word: 'hop', options: ['hip', 'hop', 'hope'] },
  { word: 'cot', options: ['cat', 'cot', 'cut'] },
  { word: 'mop', options: ['map', 'mop', 'mope'] },
  { word: 'fog', options: ['fig', 'fog', 'fug'] },
  { word: 'rod', options: ['red', 'rod', 'rid'] },
  { word: 'box', options: ['bax', 'box', 'bux'] },
];

export default function ShortOQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Record<number, string>>({});
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
    if (selected !== null) return;

    setSelected(option);
    setSelectedWords(prev => ({ ...prev, [currentIndex]: option }));
    
    const correct = currentQuestion.word;
    if (option === correct) {
      setIsCorrect(true);
      setScore(score + 1);
      Speech.speak("Great job!");
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      setQuizCompleted(true);
      Speech.speak(`You scored ${score} out of ${quizData.length}!`);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setQuizCompleted(false);
    setSelectedWords({});
  };

  const goToNextActivity = async () => {
    if (quizCompleted) {
      try {
        await saveScore('short', 'o', score, quizData.length, selectedWords);
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
    router.push('/tabs/long-o');
  };

  const getOptionStyle = (option: string) => {
    if (selected === null) return styles.optionButton;

    if (option === currentQuestion.word) {
      return [styles.optionButton, styles.correctOption];
    }

    if (selected === option && option !== currentQuestion.word) {
      return [styles.optionButton, styles.incorrectOption];
    }

    return [styles.optionButton, styles.disabledOption];
  };

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>
            You scored {score} out of {quizData.length}
          </Text>
          <Text style={styles.scorePercentage}>
            {Math.round((score / quizData.length) * 100)}%
          </Text>
          
          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: '#4CAF50' }]}
              onPress={resetQuiz}
            >
              <Text style={styles.resultButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: '#2a52be' }]}
              onPress={goToNextActivity}
            >
              <Text style={styles.resultButtonText}>Next Activity</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/tabs/short-o1')}>
        <Ionicons name="arrow-back" size={28} color="#2a52be" />
      </TouchableOpacity>

      <Text style={styles.title}>Find the Short O Word</Text>
      <Text style={styles.progressText}>Question {currentIndex + 1} of {quizData.length}</Text>

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
            disabled={selected !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Question Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
        disabled={selected === null}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Text>
      </TouchableOpacity>

      {/* Always visible and enabled Next Activity Button */}
      <TouchableOpacity
        style={[styles.nextButton, styles.nextActivityButton]}
        onPress={goToNextActivity}
      >
        <Text style={styles.nextButtonText}>Next Activity</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
    backgroundColor: '#F7F9FC',
  },
  backButton: {
    position: 'absolute',
    top: 70,
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
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
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
  disabledOption: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2a52be',
    marginTop: 20,
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextActivityButton: {
    backgroundColor: '#4CAF50',
    marginTop: 20,
   
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2a52be',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 10,
    color: '#333',
  },
  scorePercentage: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 30,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
    marginTop: 10,
  },
  resultButton: {
    flex: 1,
    marginHorizontal: 13,
    padding: 13,
    borderRadius: 30,
    alignItems: 'center',
  },
  resultButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});