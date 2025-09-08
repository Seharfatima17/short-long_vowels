import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Speech from 'expo-speech';
import { saveScore } from '../firebase/firebasehelper';

const shortEWords = [
  {
    keyword: 'pen',
    image: 'https://img.freepik.com/free-vector/vector-fountain-writing-pen-contract-signing_1284-41915.jpg',
    options: ['pane', 'pen'],
    correct: 'pen',
  },
  {
    keyword: 'bed',
    image: 'https://img.freepik.com/premium-psd/double-bed-with-wooden-frame-white-sheets-isolated_176382-168.jpg?semt=ais_hybrid&w=740',
    options: ['bed', 'bead'],
    correct: 'bed',
  },
  {
    keyword: 'net',
    image: 'https://www.pngarts.com/files/7/Scoop-Net-Transparent.png',
    options: ['neet', 'net'],
    correct: 'net',
  },
  {
    keyword: 'men',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/041/642/170/small/ai-generated-portrait-of-handsome-smiling-young-man-with-folded-arms-isolated-free-png.png',
    options: ['men', 'mean'],
    correct: 'men',
  },
  {
    keyword: 'pet',
    image: 'https://img.lovepik.com/free-png/20220127/lovepik-meng-pet-charlie-png-image_401943313_wh1200.png',
    options: ['peat', 'pet'],
    correct: 'pet',
  },
  {
    keyword: 'hen',
    image: 'https://img.freepik.com/free-psd/close-up-hen-isolated_23-2151833433.jpg?semt=ais_hybrid&w=740',
    options: ['hen', 'heen'],
    correct: 'hen',
  },
  {
    keyword: 'red',
    image: 'https://i.pinimg.com/736x/bb/7d/1d/bb7d1d9e6ad751ab1a7eee88f8ffc2bc.jpg',
    options: ['reed', 'red'],
    correct: 'red',
  },
  {
    keyword: 'ten',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/024/652/410/small/10-number-balloon-pink-png.png',
    options: ['teen', 'ten'],
    correct: 'ten',
  },
];

const ShortEActivity = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const totalQuestions = shortEWords.length;

  const handleSelect = (index, word) => {
    const correct = shortEWords[index].correct;
    const isCorrect = word === correct;

    // Allow changing answer
    setSelected(prev => ({ ...prev, [index]: word }));

    // Stop any previous speech
    Speech.stop();
    Speech.speak(isCorrect ? 'Right' : 'Wrong');

    // Update score based on change
    setScore(prev => {
      const prevWord = selected[index];
      if (!prevWord) {
        return isCorrect ? prev + 1 : prev;
      } else {
        const wasCorrect = prevWord === correct;
        if (wasCorrect && !isCorrect) return prev - 1;
        if (!wasCorrect && isCorrect) return prev + 1;
        return prev;
      }
    });

    setTimeout(() => {
      Alert.alert(
        isCorrect ? '✅ Correct!' : '❌ Try again',
        `"${word}" ${isCorrect ? 'has' : 'does not have'} the short "e" sound.`
      );
    }, 300);
  };

   const handleShowScore = async () => {
    if (Object.keys(selected).length === 0) {
      navigation.navigate('long-e');
    } else {
      setShowScore(true);
    }
  };

 const handleTryAgain = () => {
    setSelected({});
    setScore(0);
    setShowScore(false);
  };

  const handleGoNext = async () => {
    try {
      if (Object.keys(selected).length > 0) {
        await saveScore("short", "e", score, totalQuestions, selected);
      }
      navigation.navigate('long-e');
    } catch (error) {
      Alert.alert("Error", "Failed to save score. Please try again.");
      console.error(error);
    }
  };

  const isCorrect = (index, word) => word === shortEWords[index].correct;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.navigate('short-e1')}>
        <Icon name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('short-e1')}>
          <Icon name="arrow-back" size={24} color="#2a52be" />
        </TouchableOpacity>
        <Text style={styles.heading}>Select the Short "e" Word</Text>
      </View>

      <ScrollView>
        {shortEWords.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.optionsRow}>
              {item.options.map((word, i) => {
                const isSelected = selected[index] === word;
                const isAnswerCorrect = isCorrect(index, word);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.wordButton,
                      isSelected && {
                        backgroundColor: isAnswerCorrect ? '#b3f7c4' : '#f7b3b3',
                      },
                    ]}
                    onPress={() => handleSelect(index, word)}
                  >
                    <Text style={styles.wordText}>{word}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {showScore && (
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>✅ Correct: {score} / {totalQuestions}</Text>
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
          <TouchableOpacity style={styles.nextButton} onPress={handleShowScore}>
            <Text style={styles.nextButtonText}>Next Activity</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 40, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2a52be',
    flex: 1,
  },
  card: { 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  optionsRow: { 
    flexDirection: 'row', 
    gap: 10 
  },
  wordButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  wordText: { 
    fontSize: 18 
  },
  backArrow: { 
    position: 'absolute', 
    top: 12, 
    left: 16, 
    zIndex: 10 
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  nextButton: {
    backgroundColor: '#2a52be',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    width: '70%',
  },
  nextButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  scoreBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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

export default ShortEActivity;